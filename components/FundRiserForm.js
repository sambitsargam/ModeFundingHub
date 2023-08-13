import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { startFundRaising } from '../redux/interactions'
import { useDispatch, useSelector } from 'react-redux'
import { etherToWei } from '../helper/helper'
import { toastSuccess,toastError } from '../helper/toastMessage'

const FundRiserForm = () => {
   
    const crowdFundingContract = useSelector(state=>state.fundingReducer.contract)
    const account = useSelector(state=>state.web3Reducer.account)
    const web3 = useSelector(state=>state.web3Reducer.connection)

    const dispatch = useDispatch()

    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [targetedContributionAmount,setTargetedContributionAmount] = useState("")
    const [minimumContributionAmount,setMinimumContributionAmount] = useState("")
    const [deadline,setDeadline] = useState("")
    const [btnLoading,setBtnLoading] = useState(false)
  //  const onSuccess = (result) => {
  //    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
  //    window.alert(
  //      "Successfully verified with World ID! Your nullifier hash is: " +
  //        result.nullifier_hash
  //    );
  //  };

  //  const handleProof = async (result) => {
  //    console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
  //    const reqBody = {
  //      merkle_root: result.merkle_root,
  //      nullifier_hash: result.nullifier_hash,
  //      proof: result.proof,
  //      credential_type: result.credential_type,
  //      action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
  //      signal: "",
  //    };
  //    console.log(
  //      "Sending proof to backend for verification:\n",
  //      JSON.stringify(reqBody)
  //    ); // Log the proof being sent to our backend for visibility
  //    const res = await fetch("/api/verify", {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify(reqBody),
  //    });
  //    const data = await res.json();
  //    if (res.status === 200) {
  //      console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
  //    } else {
  //      throw new Error(
  //        `Error code ${res.status} (${data.code}): ${data.detail}` ??
  //          "Unknown error."
  //      ); // Throw an error if verification fails
  //    }
  //  };


    const riseFund = (e) =>{
       e.preventDefault();
       setBtnLoading(true)
       const unixDate = moment(deadline).valueOf()

       const onSuccess = () =>{
        setBtnLoading(false)
        setTitle("")
        setDescription("")
        setTargetedContributionAmount("")
        setMinimumContributionAmount("")
        setDeadline("")
        toastSuccess("Fund rising started 🎉");
      }

       const onError = (error) =>{
         setBtnLoading(false)
         toastError(error);
       }

       const data = {
        minimumContribution:etherToWei(minimumContributionAmount),
        deadline:Number(unixDate),
        targetContribution:etherToWei(targetedContributionAmount),
        projectTitle:title,
        projectDesc:description,
        account:account
       }

       startFundRaising(web3,crowdFundingContract,data,onSuccess,onError,dispatch)
    }

  return (
    <>
      <h1 className="font-sans font-bold text-xl">
        Start Fundraising for Free
      </h1>
      <form onSubmit={(e) => riseFund(e)}>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Title :</label>
          <input
            type="text"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Description :</label>
          <textarea
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">
            Targeted contribution amount :
          </label>
          <input
            type="number"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={targetedContributionAmount}
            onChange={(e) => setTargetedContributionAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">
            Minimum contribution amount :
          </label>
          <input
            type="number"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={minimumContributionAmount}
            onChange={(e) => setMinimumContributionAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-control date-picker my-1">
          <label className="text-sm text-gray-700">Deadline :</label>
          <input
            type="date"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <button
          className="p-2 w-full bg-[#F56D91] text-white rounded-md hover:bg-[#d15677]"
          disabled={btnLoading}
        >
          {btnLoading ? "Loading..." : "Raise fund"}
        </button>
      </form>
    </>
  );
}


export default FundRiserForm