import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGetMyInfo from "../hooks/mutation/useGetMyInfo";
import useUpdateMyInfo from "../hooks/mutation/useUpdateMyInfo";
import { uploadImage } from "../apis/lp";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data, isLoading } = useGetMyInfo(); // ✅ React Query로 fetch
  const { mutate: updateMyInfo } = useUpdateMyInfo();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(avatar || null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(avatar || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.data.name);
      setBio(data.data.bio || "");
      setAvatar(data.data.avatar || "");
    }
  }, [data]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("닉네임은 비워둘 수 없습니다!");
      return;
    }
    updateMyInfo({ name, bio, avatar: uploadedImageUrl });
    setEditMode(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const imageUrl = await uploadImage(file); // 서버에 업로드
        setUploadedImageUrl(imageUrl); // 🔁 상태 반영
      } catch (error) {
        console.error("이미지 업로드 실패", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) return <div className="text-center mt-10">불러오는 중...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          로그아웃
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* 프로필 이미지 */}
        <img
          src={imagePreview || avatar || "/images/pujimbao.png"}
          alt="프로필"
          className="w-24 h-24 rounded-full object-cover"
        />

        {editMode ? (
          <>
            {/* 프로필 사진 업로드 및 미리보기 */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleImageClick}
                className="bg-pink-300 text-black px-3 py-1 rounded hover:bg-pink-400 text-sm"
              >
                프로필 사진 변경
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* 이름 및 bio 수정 */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full border p-2 rounded"
            />
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개"
              className="w-full border p-2 rounded"
            />

            {/* 저장/취소 버튼 */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                저장
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">{data?.data?.name}</h2>
            <p className="text-gray-600">{data?.data?.bio || "자기소개 없음"}</p>
            <p className="text-sm text-gray-500">{data?.data?.email}</p>
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 mt-4"
            >
              설정
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
