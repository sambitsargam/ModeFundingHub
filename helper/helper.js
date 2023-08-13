import _ from 'lodash'; // Import the lodash library
import moment from "moment";
import web3 from "web3";

export const weiToEther = (num) =>{
    return web3.utils.fromWei(num, 'ether')
}

export const etherToWei = (num) => {
  const weiBigNumber = web3.utils.toWei(num, 'ether');
  const wei = weiBigNumber.toString();
  return wei
}

export const unixToDate = (unixDate) =>{
  return moment(unixDate).format("DD/MM/YYYY");
}

export const state = ["Fundraising","Expired","Successful"];

export const projectDataFormatter = (data,contractAddress) =>{
  const formattedData = {
    address:contractAddress,
    creator:data?.projectStarter,
    contractBalance: data.balance?weiToEther(data.balance):0,
    title:data.title,
    description:data.desc,
    minContribution:weiToEther(data.minContribution),
    goalAmount:weiToEther(data.goalAmount),
    currentAmount:weiToEther(data.currentAmount),
    state:state[Number(data.currentState)],
    deadline:unixToDate(Number(data.projectDeadline)),
    progress:Math.round((Number(weiToEther(data.currentAmount))/Number(weiToEther(data.goalAmount)))*100)
  }
  return formattedData;
}


const formatProjectContributions = (contributions) =>{
  const formattedData = contributions.map(data=>{
    return {
      projectAddress:data.returnValues.projectAddress,
      contributor:data.returnValues.contributor,
      amount:Number(weiToEther(data.returnValues.contributedAmount))
    }
  })
  return formattedData;
}

export const groupContributionByProject = (contributions) => {
  const contributionList = formatProjectContributions(contributions);
  //const contributionGroupByProject = _.map(_.groupBy(contributionList, 'projectAddress'), (o,projectAddress,address) => { return {projectAddress:projectAddress, contributor: address,amount: _.sumBy(o,'amount') }})
  return contributionList;
}

const formatContribution = (contributions) =>{
  const formattedData = contributions.map(data=>{
    return {
      contributor:data.returnValues.contributor,
      amount:Number(weiToEther(data.returnValues.amount))
    }
  })
  return formattedData;
}

export const groupContributors = (contributions) => {
  const contributorList = formatContribution(contributions);
  const contributorGroup = _.map(_.groupBy(contributorList, 'contributor'), (o,address) => { return { contributor: address,amount: _.sumBy(o,'amount') }})
  return contributorGroup;
}

export const withdrawRequestDataFormatter = (data) =>{
  return{
     requestId:data.requestId,
     totalVote:data.noOfVotes,
     amount:weiToEther(data.amount),
     status:data.isCompleted?"Completed":"Pending",
     desc:data.description,
     reciptant:data.reciptent
    }
}

export const connectWithWallet = async (onSuccess) => {
  // Connect web3 with http provider
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId === "0x397") {
        onSuccess();
      } else {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x397" }],
          });
          alert("Chain switched successfully try to Connect again");
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x397",
                    chainName: "Mode Testnet Chain", 
                    rpcUrls: ["https://sepolia.mode.network"],
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: "ETH",
                      decimals: 18,
                    },
                  },
                ],
              });
              alert("Chain added successfully try to Connect again");
            } catch (addError) {
              // Handle "add" error
              console.error("Error adding custom chain:", addError);
            }
          } else {
            // Handle other "switch" errors
            console.error("Error switching chain:", switchError);
          }
        }
    }
    } catch (error) {
      alert(error.message);
    }
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};


export const chainOrAccountChangedHandler = () => {
  // reload the page to avoid any errors with chain or account change.
  window.location.reload();
}
