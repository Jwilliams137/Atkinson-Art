import React from 'react';
import styles from './page.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';

function ArtworkPage() {
    const subpages = [
        { label: 'Sculpture', href: '/artwork/sculpture' },
        { label: 'Paintings', href: '/artwork/paintings' },
        { label: 'Drawings', href: '/artwork/drawings' },
    ];

    return (
        <div className={styles.main}>
            <Sidebar subpages={subpages} />
        </div>
    );
}

export default ArtworkPage;
