import { createThirdwebClient } from "thirdweb";

const clientId = "399be8c55b38801a15ec250dc7fa0a60"; // From previous context

if (!clientId) {
    throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
    clientId: clientId,
});
