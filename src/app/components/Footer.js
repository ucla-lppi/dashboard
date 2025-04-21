"use client";
import React from 'react';

export default function Footer() {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ? `/${process.env.NEXT_PUBLIC_BASE_PATH}` : '';
  return (
    <footer className="relative z-10 bg-tertiary text-black">
      <div className="mx-auto max-w-screen-lg py-8 px-4">
        <div className="grid grid-cols-[16rem_auto_auto_auto] gap-x-8 items-stretch">
          {/* Spacer column matching sidebar (w-64 = 16rem) */}
          <div></div>
          
          {/* Column 1: UCLA Logo, Quote, Social Icons */}
          <div className="flex flex-col items-start justify-self-center">
            <img
              src={`${prefix}/images/ucla_lppi_dashboard_logo.svg`}
              alt="UCLA Climate and Health Dashboard"
              className="w-[350px] sm:w-[400px] md:w-[450px] lg:w-[600px] xl:w-[789px] h-auto object-cover mb-4"
            />
            <p className="text-left font-semibold text-[20px] leading-normal mb-6">
              THERE IS NO AMERICAN AGENDA<br />WITHOUT A LATINO AGENDA
            </p>
            <div className="flex justify-start items-center space-x-4">
              <img
                src={`${prefix}/images/fb_footer.svg`}
                alt="Facebook"
                className="w-[12px] h-[20px]"
              />
              <img
                src={`${prefix}/images/yt_footer.svg`}
                alt="YouTube"
                className="w-[21px] h-[14px]"
              />
              <img
                src={`${prefix}/images/ig_footer.svg`}
                alt="Instagram"
                className="w-[21px] h-[20px]"
              />
              <img
                src={`${prefix}/images/twitter_footer.svg`}
                alt="X"
                className="w-[21px] h-[19px]"
              />
              <img
                src={`${prefix}/images/linkedin_footer.svg`}
                alt="LinkedIn"
                className="w-[21px] h-[21px]"
              />
              <img
                src={`${prefix}/images/email_footer.svg`}
                alt="Email"
                className="w-[21px] h-[14px]"
              />
            </div>
          </div>
        
          {/* Divider Column */}
          <div className="h-full flex items-center justify-center mx-2 md:mx-4 justify-self-center">
            <img 
              src={`${prefix}/images/line-31.svg`} 
              alt="Divider" 
              className="w-[1px] h-[141px] object-cover"
            />
          </div>

          {/* Site Map Section (Column 3) */}
          <div className="grid grid-cols-3 gap-x-6 md:gap-x-4 text-left text-[16px] max-w-screen-md mx-auto">
            {/* Site Map SubColumn 1 */}
            <div>
              <p className="font-bold underline">Home</p>
              <p>
                <span className="font-bold">Impact</span>
              </p>
              <p className="underline font-light">
                Research<br />Press Coverage<br />Partners<br />Policy Toolkit
              </p>
            </div>
            {/* Site Map SubColumn 2 */}
            <div>
              <p className="font-bold">About</p>
              <p className="underline font-light">
                FAQ<br />Our Data<br />Our Team<br />Contact<br /><br />
              </p>
              <p className="font-bold">Additional Resources</p>
            </div>
            {/* Site Map SubColumn 3 */}
            <div>
              <p className="font-bold">Contact</p>
              <p className="font-light">
                3250 Public Affairs Building<br />Los Angeles, CA 90065<br />(310) 206-8431<br /><br />
                <a href="mailto:latino@luskin.ucla.edu" className="underline">
                  latino@luskin.ucla.edu
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}