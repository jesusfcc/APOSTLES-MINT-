import React from 'react';

export default function SplashScreen() {
    return (
        <div className="screen splash-screen active" id="splash-screen">
            <div className="splash-content">
                <img
                    src="/images/logo.png"
                    alt="The Apostles"
                    className="apostles-logo"
                />
                <h1 className="splash-title">tHe AposTLes</h1>
            </div>
        </div>
    );
}
