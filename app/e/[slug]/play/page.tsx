
import { getGameState } from '@/lib/actions';
import { redirect } from 'next/navigation';
import PlayView from './PlayView';

export default async function PlayPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await getGameState(params.slug);

    if (!data) {
        redirect(`/e/${params.slug}`); // Redirect to join if no session
    }

    return <PlayView initialData={data} slug={params.slug} />;
}
