interface MemoryItem {
  image: string;
  caption: string;
}

type MemoryLanesType = Record<string, MemoryItem[]>;

export const memoryLanes: MemoryLanesType = {
    sonali: [
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Remember our shopping trip last summer?",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "That time we stayed up all night talking!",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Your birthday celebration last year was amazing!",
      },
    ],
    pratha: [
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Our college days were the best!",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Remember that road trip we took?",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "That time we cooked dinner together and almost burned the kitchen!",
      },
    ],
    pranav: [
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Remember when we went hiking?",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "That concert we attended was epic!",
      },
      {
        image: "/placeholder.svg?height=400&width=600",
        caption: "Our gaming marathon that lasted all weekend!",
      },
    ]
}
