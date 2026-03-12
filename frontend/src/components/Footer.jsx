import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { profileAPI } from "../services/api";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [profile, setProfile] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    profileAPI
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  const socialLinks = [
    {
      name: "GitHub",
      url: profile?.github || "https://github.com/nikunj1112",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      url:
        profile?.linkedin ||
        "https://www.linkedin.com/in/nikunj-rana-7ba712319/",
      icon: <FaLinkedin />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/nikunj.web/",
      icon: <FaInstagram />,
    },
    {
      name: "Email",
      url: "mailto:rnikunj540@gmail.com",
      icon: <FaEnvelope />,
    },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="glass-dark py-12">
      <div className="container-custom">

        {/* Top Footer */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Left */}
          <div className="justify-self-start">
            <h3 className="text-2xl font-bold gradient-text">
              {profile?.name || "Nikunj Rana"}
            </h3>

            <p className="text-light-gray/70 text-sm mt-2">
              {profile?.title || "Full Stack MERN Developer"}
            </p>

            <p className="text-light-gray/60 text-sm mt-3">
              Building beautiful and functional web applications with modern technologies.
            </p>
          </div>

          {/* Middle Quick Links */}
          <div className="justify-self-center">
            <h4 className="text-xl font-bold gradient-text">
              Quick Links
            </h4>

            <ul className="flex flex-col gap-3 mt-4 items-center">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-light-gray/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Social */}
          <div className="justify-self-end">
            <h4 className="text-xl font-semibold mb-4 gradient-text">
              Connect With Me
            </h4>

            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full glass hover:bg-accent/30 transition"
                  title={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-light-gray/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">

<p className="text-light-gray/70 text-sm">
  © {currentYear} {profile?.name || "Nikunj Rana"}. All rights reserved.
</p>

<p className="text-light-gray/50 text-sm">
  Made with ❤️ using MERN Stack
</p>

</div>
      </div>
    </footer>
  );
};

export default Footer;