import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ChatterBox from '../components/ChatterBox';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MessageBox from '../components/MessageBox';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const {address} = useAccount();

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
        <MessageBox address={address}/>
        <ChatterBox />
      </main>
    </div>
  );
};

export default Home;
