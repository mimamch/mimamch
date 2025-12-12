/* eslint-disable turbo/no-undeclared-env-vars */
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
