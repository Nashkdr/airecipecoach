
import React, { useEffect } from 'react';

// This is a type declaration to let TypeScript know that `adsbygoogle` exists on the window object.
declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

const AdBanner: React.FC = () => {

    useEffect(() => {
        try {
            // This is the command that tells AdSense to find an ad unit on the page and fill it.
            // It's placed in a useEffect hook to run after the component has rendered.
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="mt-12 w-full max-w-4xl mx-auto text-center" aria-label="Advertisement">
            {/* 
              STEP 2: This is the AdSense ad unit.
              - Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your own Publisher ID.
              - Replace 'YYYYYYYYYY' with the Ad Slot ID for this specific ad unit.
              You will get these values from your AdSense dashboard after creating an ad unit.
            */}
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="YYYYYYYYYY"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdBanner;