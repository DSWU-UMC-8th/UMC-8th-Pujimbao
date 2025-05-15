import { useState, useRef } from "react";
import usePostLp from "../hooks/mutation/usePostLp";
import { uploadImage } from "../apis/lp";

const AddLpModal = ({ onClose }: { onClose: () => void }) => {
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [lpTag, setLpTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        const imageUrl = await uploadImage(file);
        setUploadedImageUrl(imageUrl);
      } catch (error) {
        console.error("이미지 업로드 실패", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const { mutate: submitLp } = usePostLp();

  const handleSubmit = () => {// 서버로 LP 데이터 전송
    if (!lpName || !lpContent || tags.length === 0) return alert("모든 항목을 입력하세요");

    if (!uploadedImageUrl) {
      return alert("이미지를 업로드해주세요.");
    }

    submitLp({
    title: lpName,
    content: lpContent,
    tags,
    thumbnail: uploadedImageUrl, // 이미지 업로드한 URL
    published: true,
  });

    alert("LP 등록 완료!");
    onClose();
  };

  //태그 추가 및 삭제 기능
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (lpTag.trim() && !tags.includes(lpTag)) {
      setTags([...tags, lpTag]);
      setLpTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white p-6 rounded-lg w-[320px]"
        onClick={handleModalClick}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button onClick={onClose}>✖</button>
        </div>

        {/* 이미지 업로드 섹션 */}
        <div
          className="flex justify-center mb-4 cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={imagePreview || "/images/defaultLp.png"}
            alt="LP"
            className="w-32 h-32 object-cover rounded-full"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* LP 이름 입력 */}
        <input
          type="text"
          placeholder="LP Name"
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
          value={lpName}
          onChange={(e) => setLpName(e.target.value)}
        />

        {/* LP 내용 입력 */}
        <input
          type="text"
          placeholder="LP Content"
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
          value={lpContent}
          onChange={(e) => setLpContent(e.target.value)}
        />

        {/* 태그 입력 + 추가 버튼 */}
        <div className="flex mb-2 gap-2">
          <input
            type="text"
            placeholder="LP Tag"
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            value={lpTag}
            onChange={(e) => setLpTag(e.target.value)}
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-2 bg-gray-600 rounded"
          >
            Add
          </button>
        </div>

        {/* 태그 리스트 렌더링 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center"
            >
              {tag}
              <button
                onClick={() => handleDeleteTag(tag)}
                className="ml-2 text-sm hover:text-red-300"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* LP 등록 버튼 */}
        <button
          className="w-full py-2 bg-gray-400 text-black rounded hover:bg-gray-300"
          onClick={handleSubmit}
        >
          Add LP
        </button>
      </div>
    </div>
  );


};

export default AddLpModal;
