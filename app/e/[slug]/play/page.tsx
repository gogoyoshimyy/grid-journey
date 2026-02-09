
import { getGameState } from '@/lib/actions';
import { redirect } from 'next/navigation';
import PlayView from './PlayView';

export const dynamic = 'force-dynamic';

export default async function PlayPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;

    try {
        const data = await getGameState(params.slug);

        if (!data) {
            redirect(`/e/${params.slug}`); // Redirect to join if no session
        }

        return <PlayView initialData={data} slug={params.slug} />;
    } catch (error: any) {
        console.error("PlayPage Error:", error);
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
                <p className="text-slate-600 mb-4">{error.message || "予期せぬエラーです"}</p>
                <a href={`/e/${params.slug}`} className="text-blue-600 underline">トップに戻る</a>
            </div>
        );
    }
}
