/**
 * Card Component
 * Reusable card container
 */

'use client';

import React from 'react';
import styles from './Card.module.css';

const Card = ({
    children,
    padding = 'medium',
    shadow = 'small',
    className = '',
    onClick,
    ...props
}) => {
    const classNames = [
        styles.card,
        styles[`padding-${padding}`],
        styles[`shadow-${shadow}`],
        onClick && styles.clickable,
        className
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={classNames} 
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
