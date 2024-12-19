# External Resource Verifier

[![Netlify Status](https://api.netlify.com/api/v1/badges/3164880b-a0db-4291-acba-530ec5c4b239/deploy-status)](https://app.netlify.com/sites/external-resource-checker/deploys) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)]([http://shields.io/](https://external-resource-checker.netlify.app/)) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/kvanrooyen-inv/external-resource-verifier/main)

An internal tool designed to streamline the review process for external resource implementation. This tool helps trainers verify the correct implementation of requested libraries and resources without needing to dig through source code.

## Purpose

The External Resource Verifier simplifies the review process by allowing non-technical team members to easily verify if external resources have been properly implemented on a webpage. Instead of reviewing source code manually, trainers can use this tool to quickly confirm that requested changes have been implemented correctly.

## Features

### Quick Resource Verification
- Enter the URL of the page under review
- Automatically detect implemented external resources
- View the exact location where resources are implemented
- Get clear, non-technical confirmation of resource presence

### Supported Libraries
The tool checks for the following external resources:
- Bootstrap
- Vue.js
- React
- Tailwind CSS
- jQuery
- Angular
- Font Awesome
- WebGL

## How to Use

1. Access the tool through the internal network
2. Paste the URL of the page you need to review
3. Click "Verify" to scan the page
4. Review the results showing:
   - Found external resources
   - Implementation locations with code snippets
5. Share results with other trainers if needed

## Benefits

- **Simplified Review Process**: No technical knowledge required to verify implementations
- **Time Savings**: Quickly confirm resource presence without code review
- **Reduced Errors**: Automated detection helps prevent oversight
