import React from 'react';
import VersionInput from './VersionInput';

const CustomVersions = () => {
    return (
        <div style={styles.versionContainer}>
            <h3 style={styles.versionTitle}>Ingresa tu version de Forge</h3>
            <VersionInput />
        </div>
    );
};

const styles: { versionContainer: React.CSSProperties, versionTitle: React.CSSProperties } = {
    versionContainer: {
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        flexGrow: 1, 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },    
    versionTitle: {
        marginBottom: '15px',
        fontSize: '18px', 
        fontWeight: 'bold' as React.CSSProperties['fontWeight'],
        textAlign: 'center' as React.CSSProperties['textAlign'],
        color: '#3a3a3a',
    },
};

export default CustomVersions;
