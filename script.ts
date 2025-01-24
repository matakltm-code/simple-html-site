document.getElementById('search-input')?.addEventListener('keyup', async (e: Event) => {
    const inputElement = e.target as HTMLInputElement
    const query = inputElement.value.trim()

    if (!query) {
        const $results = document.getElementById('results')
        if ($results) {
            $results.innerHTML = ''
        }
        return;
    }


    try {
        const res = await fetch(`http://localhost:3001/?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error('Failed to fetch results');

        const json: { name: string }[] = await res.json()

        // const result = `<li>${json.join('</li><li>')}</li>`
        const result = json.map((item) => `<li>${item.name}</li>`).join('');
        const $results = document.getElementById('results')
        if ($results) {
            $results.innerHTML = result || '<p class="no-results">No results found</p>';
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        const $results = document.getElementById('results');
        if ($results) {
            $results.innerHTML = '<p>Something went wrong. Please try again later.</p>';
        }
    }
})