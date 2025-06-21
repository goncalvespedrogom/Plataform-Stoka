import type { NextConfig } from "next";
import withTM from 'next-transpile-modules';

const withTranspileModules = withTM(['react-datepicker']);

export default withTranspileModules({
  /* config options here */
  reactStrictMode: true,
});
