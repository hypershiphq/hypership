export const getHypershipPublicKey = () => {
  if (process.env[`REACT_APP_HYPERSHIP_PUBLIC_KEY`]) {
    return process.env[`REACT_APP_HYPERSHIP_PUBLIC_KEY`];
  } else if (process.env[`NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY`]) {
    return process.env[`NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY`];
  } else {
    return process.env.HYPERSHIP_PUBLIC_KEY;
  }
}
