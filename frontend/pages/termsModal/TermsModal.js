'use client';

import React, { useCallback } from 'react';
import styles from './termsModal.module.css';

export default function TermsModal({ isOpen, onClose, onAgree }) {
    const handleAgree = useCallback(() => {
        onAgree?.();
    }, [onAgree]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Terms of Service & Privacy Policy</h2>
                
                <div className={styles.modalBody}>
                    <h3>Terms of Service</h3>
                    <p>
                        Welcome to Optivo. These Terms of Service ("Terms") govern your use of our platform and services. 
                        By accessing and using Optivo, you agree to be bound by these Terms.
                    </p>
                    <p>
                        <strong>Use License:</strong> We grant you a limited, non-exclusive, non-transferable license to use our platform 
                        for lawful purposes. You agree not to use this platform in any way that violates any applicable law or regulation.
                    </p>
                    <p>
                        <strong>User Responsibilities:</strong> You are responsible for maintaining the confidentiality of your account 
                        credentials and are fully responsible for all activities that occur under your account. You agree to notify us 
                        immediately of any unauthorized use of your account.
                    </p>
                    <p>
                        <strong>Content Ownership:</strong> All content provided on Optivo, including but not limited to text, graphics, 
                        logos, images, and software, is the property of Optivo or its content suppliers and is protected by international copyright laws.
                    </p>
                    <p>
                        <strong>Limitation of Liability:</strong> To the fullest extent permissible by law, Optivo shall not be liable 
                        for any indirect, incidental, special, or consequential damages arising from your use or inability to use our services.
                    </p>

                    <h3>Privacy Policy</h3>
                    <p>
                        <strong>Information Collection:</strong> We collect information you provide directly to us, such as when you create 
                        an account, including your name, email address, and password. We also collect information automatically when you 
                        use our platform, such as cookies and usage data.
                    </p>
                    <p>
                        <strong>Use of Information:</strong> We use your information to provide, maintain, and improve our services, to 
                        communicate with you about your account, and to comply with legal obligations. We may also use your information 
                        to send you promotional materials, which you can opt out of at any time.
                    </p>
                    <p>
                        <strong>Data Security:</strong> We employ industry-standard security measures to protect your personal information. 
                        However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
                    </p>
                    <p>
                        <strong>Third-Party Sharing:</strong> We do not sell, trade, or rent your personal information to third parties. 
                        We may share information with service providers who assist us in operating our platform and conducting our business, 
                        provided they agree to keep such information confidential.
                    </p>
                    <p>
                        <strong>Your Rights:</strong> You have the right to access, update, and delete your personal information at any time. 
                        You can contact us with any privacy-related questions or concerns.
                    </p>
                </div>

                <div className={styles.modalActions}>
                    <button
                        type="button"
                        className={styles.agreeButton}
                        onClick={handleAgree}
                    >
                        I Agree
                    </button>
                    <button
                        type="button"
                        className={styles.declineButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
