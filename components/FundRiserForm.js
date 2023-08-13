import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { startFundRaising } from '../redux/interactions'
import { useDispatch, useSelector } from 'react-redux'
import { etherToWei } from '../helper/helper'
import { toastSuccess,toastError } from '../helper/toastMessage'
import WorldcoinButton from "./WorldcoinButton";

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
      <div className="w-6/12 bg-white py-5 flex rounded-[20px] items-center">
        <div className="flex items-end flex-col px-5">
          <h1 className="text-black text-right text-sm p-0 mb-3">
            Prove your uniqueness and humaness. <br></br>
            Verify your account using World ID
          </h1>
          {verified ? (
            <button
              disabled={true}
              className="cursor-pointer border-none px-5 py-2 rounded-md w-fit mx-auto bg-black hover:opacity-90 hover:bg-black transition"
            >
              You are verified 🎉
            </button>
          ) : (
            <WorldcoinButton signer={signer}></WorldcoinButton>
          )}
        </div>
      </div>
    </>
  );
}

export default FundRiserForm