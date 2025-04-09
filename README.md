# LangChain Translation Tool

![LangChain Translation Tool](./public/welcome.png)
![LangChain Translation Tool](./public/chat.png)
## Description

The LangChain Translation tool can perform translation tasks and automatically identify the optimal model for translation.


## Configuration

1. Create the env var file
    ```bash
    Copy .env.example to .env and fill in the appropriate values.
    ```

2. Generate and set the Agent Private Key
   ```bash
   w3 key create
   ```
   - Copy the private key (e.g., `MgCbWL...6wFKE=`) and set it to the `VITE_STORACHA_AGENT_PRIVATE_KEY` env var.
   - Copy the Agent DID key (e.g., `did:key:...`) to create the Agent Delegation.


## Start Demo
1. Build and start the agent from the project root folder
    ```bash
    pnpm i
    pnpm dev
    ```

2. Open http://localhost:5173 in browser and have fun


## Development

1. Clone the repository

2. Install dependencies