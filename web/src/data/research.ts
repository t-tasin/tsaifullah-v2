export type Paper = {
  title: string;
  authors: string[];
  venue: string;
  year: string;
  status: string;
  abstract: string;
  keywords: string[];
  links: { paper?: string };
};

export const research: Paper[] = [
  {
    title: "Multi-Agent Coordination in Autonomous Vehicle Routing: A Simulation-Based Study",
    authors: ["KM Khalid Saifullah"],
    venue: "Research Paper",
    year: "2025",
    status: "Published",
    abstract: "This study explores how multi-agent interaction enhances autonomous vehicle (AV) decision-making in dynamic traffic environments. While traditional AV models focus on individual autonomy, real-world traffic scenarios often require collective behavior through inter-agent communication and coordination. To investigate this, we developed a graph-based simulation environment that enables vehicle agents to exchange information and reroute in real time in response to road obstacles. Our findings demonstrate that communication and adaptive rerouting significantly reduce average wait times and improve travel efficiency. Furthermore, we introduce a lightweight memory mechanism—Object Memory Management (OMM)—which allows agents to retain knowledge of previously encountered obstacles. This feature proved critical in avoiding routing loops and redundant decisions. Together, these results highlight the potential of communication- and memory-enhanced agents in creating resilient, cooperative AV systems capable of navigating complex and unpredictable traffic networks.",
    keywords: ["Autonomous Vehicles", "Multi-Agent Systems", "V2V Communication", "Dynamic Rerouting", "Traffic Simulation"],
    links: { paper: "https://arxiv.org/pdf/2511.17656" }
  },
  {
    title: "Sentiment Analysis in Software Engineering: Evaluating Generative Pre-trained Transformers",
    authors: ["KM Khalid Saifullah"],
    venue: "National Conference on Undergraduate Research (NCUR)",
    year: "2024",
    status: "Published",
    abstract: "Sentiment analysis plays a crucial role in understanding developer interactions, issue resolutions, and project dynamics within software engineering (SE). While traditional SE-specific sentiment analysis tools have made significant strides, they often fail to account for the nuanced and context-dependent language inherent to the domain. This study systematically evaluates the performance of bidirectional transformers, such as BERT, against generative pre-trained transformers, specifically GPT-4o-mini, in SE sentiment analysis. Using datasets from GitHub, Stack Overflow, and Jira, we benchmark the models' capabilities with fine-tuned and default configurations. The results reveal that fine-tuned GPT-4o-mini performs comparable to BERT and other bidirectional models on structured and balanced datasets like GitHub and Jira, achieving macro-averaged F1-scores of 0.93 and 0.98, respectively. However, on linguistically complex datasets with imbalanced sentiment distributions, such as Stack Overflow, the default GPT-4o-mini model exhibits superior generalization, achieving an accuracy of 85.3% compared to the fine-tuned model's 13.1%. These findings highlight the trade-offs between fine-tuning and leveraging pre-trained models for SE tasks.",
    keywords: ["Sentiment Analysis", "Software Engineering", "Transformer Models", "GPT", "BERT", "Fine-tuning", "NLP"],
    links: { paper: "https://arxiv.org/pdf/2505.14692" }
  }
];
