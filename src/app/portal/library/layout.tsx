
import PortalLayout from '../layout';

export default function LibraryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout simply re-uses the main portal layout to ensure
    // that the library page and any future sub-pages are also
    // protected by the authentication gate.
    return <PortalLayout>{children}</PortalLayout>;
}
