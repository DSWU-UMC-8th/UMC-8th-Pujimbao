import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const [search, setSearch] = useState("타입");
  const {data, isPending, isError} = useGetLpList({search});

  if (!isPending) { //Loading UI
    return <div>Loading...</div>
  }

  if (isError) { // Error UI
    return <div>Error</div>
  }


  return (
    <div className={"mt-20"}>
      <input value={search} onChange={(e)=>setSearch(e.target.value)}/>
      {data?.map((lp)=><h1>{lp.title}</h1>)}
    </div>
  )
};

export default HomePage;