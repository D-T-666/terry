export async function loadTests() {
  return [
    {
      id: "123",
      name: "რაღაცა ტესტი",
      description:
        `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
      tags: {
        კვლევა: ["PISA"],
        საგანი: ["კითხვა", "ბუნებისმეტყველება", "მათემატიკა"],
      },
    },
    {
      id: "41241",
      name: "სხვა ტესტი",
      description: ``,
      tags: {
        კვლევა: ["PIRLS"],
        საფეხური: ["საბაზისო"],
        საგანი: ["მათემატიკა"],
      },
    },
  ];
}
