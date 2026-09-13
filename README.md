# PassIt Application

## For Developers
This project uses GitHub Actions to build and push the Docker image to GitHub Container Registry.

### Setting Public Access
1. Push your code to main.
2. After the GitHub Action finishes, go to your GitHub repository -> **Packages** (on the right sidebar).
3. Click on `passit-app`.
4. Under **Package settings**, scroll down to **Danger Zone** and change visibility to **Public**.

## For Teachers (Deployment)
1. Ensure the machine has internet access.
2. Download `setup.sh`.
3. Ensure you have replaced `YOUR_GITHUB_USERNAME` in `setup.sh` and `docker-compose.yml` with the repository owner's username.
4. Run `chmod +x setup.sh` and `./setup.sh`.
5. Access the app at `http://localhost:5001`.
