const bootSequence = [
    "Booting...",
    "Loading interaction modules...",
    "Looking for user...",
    "User detected.",
    "Identity: Unknown",
    "Starting verification..."
];

const identityPage = {
    title: "Identity Verification",
    subtitle: "Just one thing first.",
    question: "Who are you?",

    options: [

        {
            id: "princess",
            text: "Princess",
            response: "Identity confirmed. Perfect."
        },

        {
            id: "negin",
            text: "Negin",
            response: "Nah... Princess it is."
        },

        {
            id: "other",
            text: "Someone else"
        }

    ]
};