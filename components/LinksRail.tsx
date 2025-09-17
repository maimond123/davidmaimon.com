import { Github, Linkedin, Twitter, Link2, Mail } from "lucide-react";

const links = [
  { name: "GitHub", href: "https://github.com/maimond123", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/david-maimon-3227ab23a", icon: Linkedin },
  { name: "X / Twitter", href: "https://x.com/ma1mon1des", icon: Twitter },
  { name: "Old Site", href: "https://startuptechnologies.wixsite.com/davidmaimon", icon: Link2 },
  { name: "Email", href: "mailto:david.maimon@duke.edu", icon: Mail },
];

export default function LinksRail() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {links.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-surface/60 hover:border-lime/60 hover:shadow-glow transition"
        >
          <Icon className="w-4 h-4 text-ice group-hover:text-lime" />
          <span className="font-mono text-sm">{name}</span>
        </a>
      ))}
    </div>
  );
}

