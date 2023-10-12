# Toktik Frontend

Github actions is not set up because we are broke. Instead, we are utilizing git hooks to do the *"automated"* package building.

To use git hooks, simply run
```sh
./setup.sh
```
This will install the pre-push hook to your `.git` directory and it will build and push the frontend package to GitHub every time you push the code from your local machine to the remote repository (this repo).
I hated every second of setting this up.
