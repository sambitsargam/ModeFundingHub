import { React, useEffect, useCallback } from "react";
import authWrapper from "../helper/authWrapper";
import FundRiserForm from "../components/FundRiserForm";
import { useSelector } from "react-redux";
import FundRiserCard from "../components/FundRiserCard";
import Loader from "../components/Loader";
import { useIDKit } from "@worldcoin/idkit";
import dynamic from "next/dynamic";

const Dashboard = () => {

  const projectsList = useSelector(state=>state.projectReducer.projects)
  const IDKitWidget = dynamic(
    () => import("@worldcoin/idkit").then((mod) => mod.IDKitWidget),
    { ssr: false }
  );

  const { open, setOpen } = useIDKit();

  const handleProof = useCallback((result) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div className="px-2 py-4 flex flex-col lg:px-12 lg:flex-row ">
      <div className="lg:w-7/12 my-2 lg:my-0 lg:mx-2">
        {projectsList !== undefined ? (
          projectsList.length > 0 ? (
            projectsList.map((data, i) => (
              <FundRiserCard props={data} key={i} />
            ))
          ) : (
            <h1 className="text-2xl font-bold text-gray-500 text-center font-sans">
              No project found !
            </h1>
          )
        ) : (
          <Loader />
        )}
      </div>
      <div className="card lg:w-5/12 h-fit my-4">
        <IDKitWidget
          action="my_signal"
          signal="my_signal"
          handleVerify={handleProof}
          onSuccess={(result) => console.log(result)}
          app_id="app_staging_add54a8fabc8467293ab274bfee34aa4" // obtain this from developer.worldcoin.org
        />
      </div>
    </div>
  );
};

export default authWrapper(Dashboard);
