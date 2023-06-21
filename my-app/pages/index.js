import Head from 'next/head';
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import { useEffect, useRef, useState } from 'react';
import { Contract, ethers, providers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/constants';

export default function Home() {
    const web3modalRef = useRef()
    const [tokenIdsMinted, setTokenIdsMinted] = useState("0")
    const [walletConntected, setWalletConnected] = useState(false)
    const [maxLimitOfTokens, setMaxLimitOfTokens] = useState("0")
    const [loading, setLoading] = useState(false)

    const publicMint = async () => {
        try {
            const signer = await getSignerOrProvider(true)
            const contract = new Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            )
            setLoading(true)
            const tx = await contract.mint({
                value: ethers.utils.parseEther("0.01")
            })
            await tx.wait()
            setLoading(false)
            window.alert("You successfully minted a LW3Punk!");
        } catch (err) {
            console.error(err);
        }
    }

    const getSignerOrProvider = async (needSigner = false) => {
        try {
            const provider = await web3modalRef.current.connect()
            const web3Provider = new providers.Web3Provider(provider)
            const { chainId } = await web3Provider.getNetwork()

            if (chainId !== 80001) {
                alert("Switch chain to Mumbai")
                throw new Error("Switch chain to Mumbai")
            }

            if (needSigner) {
                const signer = web3Provider.getSigner()
                return signer
            }

            return web3Provider
        } catch (err) {
            console.error(err);
        }
    }

    const connectWallet = async () => {
        try {
            await getSignerOrProvider()
            setWalletConnected(true)
        } catch (err) {
            console.error(err);
        }
    }

    const getTokenIdsMinted = async () => {
        try {
            const provider = await getSignerOrProvider()
            const contract = new Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                provider
            )
            const _tokenIdsMinted = await contract.tokenIds()
            setTokenIdsMinted(_tokenIdsMinted.toString())
        } catch (err) {
            console.error(err);
        }
    }

    const getMaxLimitOfTokens = async () => {
        try {
            const provider = await getSignerOrProvider()
            const contract = new Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                provider
            )
            const _maxLimitOfTokens = await contract.maxTokenIds()
            setMaxLimitOfTokens(_maxLimitOfTokens.toString())
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!walletConntected) {
            web3modalRef.current = new Web3Modal({
                network: "mumbai",
                disableInjectedProvider: false,
                providerOptions: {}
            })
            connectWallet()

            getTokenIdsMinted();
            getMaxLimitOfTokens()

            setInterval(async function () {
                await getTokenIdsMinted();
            }, 5 * 1000);
        }
    }, [walletConntected])

    const renderButton = () => {
        if (!walletConntected) {
            return (
                <button onClick={connectWallet} className={styles.button}>
                    Connect your wallet
                </button>
            );
        }

        if (loading) {
            return <button className={styles.button}>Loading...</button>;
        }

        return (
            <button className={styles.button} onClick={publicMint}>
                Public Mint 🚀
            </button>
        );
    };

    return (
        <div>
            <Head>
                <title>LW3Punks</title>
                <meta name="description" content="LW3Punks-Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Welcome to LW3Punks!</h1>
                    <div className={styles.description}>
                        It&#39;s an NFT collection for LearnWeb3 students.
                    </div>
                    <div className={styles.description}>
                        {tokenIdsMinted}/{maxLimitOfTokens} have been minted
                    </div>
                    {renderButton()}
                </div>
                <div>
                    <img className={styles.image} src="./LW3Punks/1.png" />
                </div>
            </div>

            <footer className={styles.footer}>Made with &#10084; by LW3Punks</footer>
        </div>
    );
}