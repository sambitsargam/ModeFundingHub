import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import authWrapper from '../helper/authWrapper';

const MyAccount = () => {
    const account = useSelector(state => state.web3Reducer.account);
    const web3 = useSelector(state => state.web3Reducer.connection);

    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (web3 && account) {
            fetchBalance();
        }
    }, [web3, account]);

    const fetchBalance = async () => {
        try {
            const weiBalance = await web3.eth.getBalance(account);
            const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
            setBalance(etherBalance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    return (
        <div className="px-2 py-4 flex flex-col lg:px-12 lg:flex-row">
            <div className="lg:w-7/12 my-2 lg:my-0 lg:mx-2">
                <h1 className="text-2xl font-bold text-gray-500 text-center font-sans">
                    My Wallet Address: {account}
                </h1>
                {balance !== null ? (
                    <h1 className="text-2xl font-bold text-gray-500 text-center font-sans">
                        My Balance: {balance} Ether
                    </h1>
                ) : (
                    <p>Loading balance...</p>
                )}
            </div>
        </div>
    );
};

export default authWrapper(MyAccount);
