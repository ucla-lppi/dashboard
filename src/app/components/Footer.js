import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-brandPink text-white">
      <div className="relative h-[189px] w-full">
        {/* UCLA logo */}
        <img 
          src="./static/img/ucla_lppi_dashboard_logo.png"
          alt="UCLA Luskin"
          className="absolute w-[362px] h-[64px] top-[11px] left-[275px] object-cover"
        />
        {/* Footer Quote */}
        <p className="absolute top-[83px] left-[281px] font-[600] text-[20px] leading-normal">
          THERE IS NO AMERICAN AGENDA<br />WITHOUT A LATINO AGENDA
        </p>
        {/* Social Icons */}
        <img 
          src="./static/img/yt_footer.svg" 
          alt="YouTube" 
          className="absolute w-[21px] h-[14px] top-[147px] left-[306px]" 
        />
        <img 
          src="./static/img/ig_footer.svg" 
          alt="Instagram" 
          className="absolute w-[21px] h-[20px] top-[144px] left-[341px]" 
        />
        <img 
          src="./static/img/twitter_footer.svg" 
          alt="X" 
          className="absolute w-[21px] h-[19px] top-[144px] left-[375px]" 
        />
        <img 
          src="./static/img/fb_footer.svg" 
          alt="Facebook" 
          className="absolute w-[12px] h-[20px] top-[144px] left-[281px]" 
        />
        <img 
          src="./static/img/email_footer.svg" 
          alt="Email" 
          className="absolute w-[21px] h-[14px] top-[147px] left-[443px]" 
        />
        <img 
          src="./static/img/linkedin_footer.svg" 
          alt="LinkedIn" 
          className="absolute w-[21px] h-[21px] top-[142px] left-[409px]" 
        />
        {/* Footer Links */}
        <div className="absolute top-[23px] left-[820px] text-[16px]">
          <p className="font-bold underline">Home</p>
          <p>
            <span className="font-bold">Impact</span>
          </p>
          <p className="underline font-light">
            Research<br />Press Coverage<br />Partners<br />Policy Toolkit
          </p>
        </div>
        <div className="absolute top-[23px] left-[972px] text-[16px]">
          <p className="font-bold">About</p>
          <p className="underline font-light">
            FAQ<br />Our Data<br />Our Team<br />Contact<br /><br />
          </p>
          <p className="font-bold">Additional Resources</p>
        </div>
        <div className="absolute top-[23px] left-[1181px] text-[16px]">
          <p className="font-bold">Contact</p>
          <p className="font-light">
            3250 Public Affairs Building <br />Los Angeles, CA 90065 <br />(310) 206-8431<br /><br />
          </p>
          <p className="font-light"><a href="mailto:latino@luskin.ucla.edu">latino@luskin.ucla.edu</a></p>
        </div>
        {/* Divider */}
        <img 
          src="./static/img/line-31.svg" 
          alt="Divider" 
          className="absolute w-[1px] h-[141px] top-[24px] left-[756px] object-cover"
        />
      </div>
    </footer>
  );
}
