import React from 'react';
import hero from "../../assets/hero.png";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const FooterPage = () => {
  return (
    <footer className="bg-green-50 py-12 px-4  relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img src={hero} alt="" className="w-16 h-16 mr-2" />
            <h2 className="text-3xl font-bold text-green-600">organis</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex space-x-4">
            <SocialIcon icon={<FacebookIcon />} />
            <SocialIcon icon={<TwitterIcon />} />
            <SocialIcon icon={<InstagramIcon />} />
            <SocialIcon icon={<YouTubeIcon />} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <ContactItem icon={<EmailIcon />} title="Email" content="support@organis.com" />
          <ContactItem icon={<LocalPhoneIcon />} title="Phone" content="+1 964 123 456789" />
          <ContactItem icon={<LocationOnIcon />} title="Address" content="56 King Street, New York" />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick links</h3>
          <div className="grid grid-cols-2 gap-2">
            {['About us', 'Privacy Policy', 'Cookie Policy', 'Terms and Conditions', 'Purchasing Policy', 'Affiliate', 'Career', 'Contact us', 'Shopping cart', 'My account', 'Order Tracking', 'Delivery Information'].map((link) => (
              <a key={link} href="#" className="text-gray-600 hover:text-green-600 transition duration-300">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-300">
    {icon}
  </a>
);

const ContactItem = ({ icon, title, content }) => (
  <div className="flex items-start">
    <div className="bg-green-500 text-white p-2 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

export default FooterPage;
