# AWS Deployment Guide (CI/CD)

This document explains how to set up the AWS infrastructure required by our GitHub Actions Continuous Deployment (CD) pipeline.

## 1. Prerequisites (Free Tier)
1. Create an AWS Account (if you don't have one).
2. Go to the AWS Console.

## 2. Infrastructure Setup

### A. S3 Bucket (Hosting)
1. Go to **S3** -> **Create bucket**.
2. Name it something unique (e.g., `mario-portfolio-store-ddd`).
3. **Block Public Access settings**: Uncheck "Block all public access" (you want the web to see it).
4. Create the bucket.
5. Go to the bucket's **Properties**, scroll to the bottom, and enable **Static website hosting**.
6. Set the Index document to `index.html`.

### B. CloudFront (CDN & HTTPS)
1. Go to **CloudFront** -> **Create Distribution**.
2. **Origin domain**: Select your S3 bucket from the dropdown.
3. **Origin access**: Choose *Origin access control settings (recommended)* and create a new control. This is more secure than making the bucket fully public.
4. **Default Cache Behavior**:
   - Viewer protocol policy: *Redirect HTTP to HTTPS*
5. Create Distribution.
6. CloudFront will give you a Bucket Policy policy. Go back to S3 -> Permissions -> Bucket Policy, and paste it.

### C. IAM User (For GitHub Actions)
1. Go to **IAM** -> **Users** -> **Add users**.
2. Name: `github-actions-deployer`.
3. Policies to attach directly: `AmazonS3FullAccess` and `CloudFrontFullAccess`. *(Note: For a real enterprise environment, you would use least-privilege custom policies or OIDC).*
4. Create user.
5. Go to the user -> **Security credentials** -> **Create access key**.
6. Choose "Third-party service". Save the **Access Key** and **Secret Key**.

## 3. GitHub Secrets Configuration
Go to your GitHub Repository -> **Settings** -> **Environments** -> **New environment**.
Name it exactly: `production`.

Inside the `production` environment, add these Environment Secrets:
- `AWS_ACCESS_KEY_ID` (from step 2.C)
- `AWS_SECRET_ACCESS_KEY` (from step 2.C)
- `AWS_S3_BUCKET` (the name of your bucket, e.g., `mario-portfolio-store-ddd`)
- `AWS_CLOUDFRONT_ID` (the ID of your CloudFront distribution, e.g., `E1XXXXXXX`)

## How it works
Once this is set up, every time you push to `main` (or merge a Pull Request into `main`), GitHub Actions will:
1. Run all unit tests using Vitest/Karma.
2. Build the Angular application.
3. Upload the `dist` folder as an artifact.
4. Pass the artifact to the `deploy-production` job.
5. Use your secrets to sync the files to S3.
6. Invalidate the CloudFront cache so users see the latest version instantly.
