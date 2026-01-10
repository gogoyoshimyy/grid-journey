
import prisma from '@/lib/db';
import TileEditor from './TileEditor';

export default async function TileEditorPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: { tiles: { orderBy: [{ coordinateY: 'asc' }, { coordinateX: 'asc' }] } }
    });

    if (!event) return <div>Not found</div>;

    return <TileEditor event={event} />;
}
