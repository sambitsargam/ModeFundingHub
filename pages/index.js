import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';
import { loadAccount } from '../redux/interactions';

export default function Home() {

  const router = useRouter();
  const dispatch = useDispatch();
  const web3 = useSelector(state => state.web3Reducer.connection)

  const connect = () =>{
    const onSuccess = () =>{
      loadAccount(web3,dispatch)
      router.push('/dashboard')
    }
    connectWithWallet(onSuccess)
  }

  useEffect(() => {
     (async()=>{
      if(web3){
        const account = await loadAccount(web3,dispatch)
        if(account.length > 0){
          router.push('/dashboard')
        }
      }
     })()
  }, [web3])// eslint-disable-line react-hooks/exhaustive-deps

  

  return (
    <div className="flex flex-col items-center justify-center my-40">
    <h1 className="text-8xl font-bold text-[#F7C984]">ModeFundingHub</h1>
    <button className="p-4 my-10 text-lg font-bold text-white rounded-md w-56 bg-[blue] drop-shadow-md hover:bg-[lightblue] hover:drop-shadow-xl" onClick={()=>connect()}>Connect MetaMask</button>
    <h3 className="text-lg text-[blue]">Connect with Mode Testnet</h3>
  </div>
  )  
}
