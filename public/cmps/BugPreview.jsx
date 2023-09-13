

export function BugPreview({ bug }) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Description : <span>{bug.description}</span></p>
        {Array.isArray(bug.labels) && bug.labels.length > 0 && (
            <p>Labels: <span>{bug.labels.join(', ')}</span></p>
        )}
        
    </article>
}