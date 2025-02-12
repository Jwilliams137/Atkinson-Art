
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    <li>
                        <Link href="/artwork">Artwork</Link>
                    </li>
                    <li>
                        <Link href="/artwork/sculpture">Sculpture</Link>
                    </li>
                    <li>
                        <Link href="/artwork/paintings">Paintings</Link>
                    </li>
                    <li>
                        <Link href="/artwork/drawings">Drawings</Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
