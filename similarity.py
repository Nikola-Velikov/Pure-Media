import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from yellowness import calculate_yellowness

used_fake_words_media = {
    'BTA': [],
    'Mediapool': [],
    'Pik': []
}

total_yellowness_media = {
    'BTA': [],
    'Mediapool': [],
    'Pik': []
}


def load_news(file_path):
    news = []
    with open(file_path, 'r', encoding='utf-8') as file:
        data = file.read()
        # Split the file into individual news articles
        entries = data.split("Title")
        for entry in entries:
            if entry.strip():
                # Extract title and content
                match = re.search(r"(.*?)\s?:\s?(.*)", entry.strip(), re.DOTALL)
                if match:
                    title, content = match.groups()
                    news.append({"title": title.strip(), "content": content.strip()})

    return news


# Match news using TF-IDF and cosine similarity
def match_news(news1, news2, threshold=0.75):
    results = []
    texts1 = [item["content"] for item in news1]
    texts2 = [item["content"] for item in news2]

    # Vectorize content
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts1 + texts2)

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix[:len(texts1)], tfidf_matrix[len(texts1):])

    for i, row in enumerate(similarity_matrix):
        for j, score in enumerate(row):
            if score >= threshold:
                results.append((i, j, score))

    return results


def find_matches(file1, file2, file3, threshold=0.75):
    news1 = load_news(file1)
    news2 = load_news(file2)
    news3 = load_news(file3)

    # Match combinations
    matches_12 = match_news(news1, news2, threshold)
    matches_13 = match_news(news1, news3, threshold)
    matches_23 = match_news(news2, news3, threshold)

    # Combine matches
    combined_matches = []
    matched_indices = set()

    # Matches between three files
    for m1, m2, _ in matches_12:
        for m1_3, m3, _ in matches_13:
            if m1 == m1_3:
                combined_matches.append({
                    "news1": news1[m1],
                    "matches": [news2[m2], news3[m3]],
                    "type": 'BTA, Mediapool, Pik'
                })
                matched_indices.add((m1, "news1"))
                matched_indices.add((m2, "news2"))
                matched_indices.add((m3, "news3"))

    # Matches between two files
    for m1, m2, _ in matches_12:
        if (m1, "news1") not in matched_indices and (m2, "news2") not in matched_indices:
            combined_matches.append({
                "news1": news1[m1],
                "matches": [news2[m2]],
                "type": 'BTA, Mediapool'
            })
            matched_indices.add((m1, "news1"))
            matched_indices.add((m2, "news2"))

    for m1, m3, _ in matches_13:
        if (m1, "news1") not in matched_indices and (m3, "news3") not in matched_indices:
            combined_matches.append({
                "news1": news1[m1],
                "matches": [news3[m3]],
                "type": 'BTA, Pik'

            })
            matched_indices.add((m1, "news1"))
            matched_indices.add((m3, "news3"))

    for m2, m3, _ in matches_23:
        if (m2, "news2") not in matched_indices and (m3, "news3") not in matched_indices:
            combined_matches.append({
                "news2": news2[m2],
                "matches": [news3[m3]],
                "type": 'Mediapool, Pik'

            })
            matched_indices.add((m2, "news2"))
            matched_indices.add((m3, "news3"))

    return combined_matches


def load_words(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return [line.strip().lower() for line in file.readlines()]


def find_words_in_text(words, text):
    found_words = set()
    for word in words:
        if re.search(rf'\b{re.escape(word)}\b', text):
            found_words.add(word)
    return list(found_words)


def process_news_and_matches(file, news_data):
    # Load words
    words = load_words(file)

    # Iterate over each news item
    for i, news_item in enumerate(news_data):
        news_key = list(news_item.keys())[0]  # Get the first key in the dictionary - news1 or news2
        news = news_item.get(news_key, {})
        type_media = news_item.get('type').split(', ')
        print(f"Processing {news['title']}:")

        matched_words = find_words_in_text(words, (news['title'] + " " + news['content']).lower())
        if matched_words:
            total_yellowness_media[type_media[0]].append(1)
        else:
            total_yellowness_media[type_media[0]].append(0)

        print(f"Words in {type_media[0]}: {', '.join(matched_words) or '0'}")

        # Update words list by removing matched words
        words = [word for word in words if word not in matched_words]
        for j, media_news in enumerate(news_item.get('matches', [])):
            text = (media_news['title'] + " " + media_news['content']).lower()
            matched_in_match = find_words_in_text(words, text)

            if matched_in_match:
                total_yellowness_media[type_media[j + 1]].append(1)
                for w in matched_in_match:
                    used_fake_words_media[type_media[j + 1]].append(w)
                print(f"Words used by {type_media[j + 1]}: {', '.join(matched_in_match)}")
            else:
                total_yellowness_media[type_media[j + 1]].append(0)
                print(f"Words in {type_media[j + 1]}: 0")

    bta = used_fake_words_media["BTA"]
    mediapool = used_fake_words_media["Mediapool"]
    pik = used_fake_words_media["Pik"]
    yellowness_bta = total_yellowness_media["BTA"]
    yellowness_mediapool = total_yellowness_media["Mediapool"]
    yellowness_pik = total_yellowness_media["Pik"]
    print('\n--------------\n')
    print(
        f'Words used by BTA: {", ".join(bta) + f"- {len(bta)} words. This is equal to {round(sum(yellowness_bta) / len(yellowness_bta), 2)*100} % using scandal language" or "0"}', f'- {sum(yellowness_bta)} news from {len(yellowness_bta)} matched news')
    print(
        f'Words used by Mediapool: {", ".join(mediapool) + f"- {len(mediapool)} words. This is equal to {round(sum(yellowness_mediapool) / len(yellowness_mediapool), 2)*100} % using scandal language" or "0"}', f'- {sum(yellowness_mediapool)} news from {len(yellowness_mediapool)} matched news')
    print(
        f'Words used by Pik: {", ".join(pik) + f"- {len(pik)} words. This is equal to {round(sum(yellowness_pik) / len(yellowness_pik), 2)*100} % of the news are using scandal language" or "0"}', f'- {sum(yellowness_pik)} news from {len(yellowness_pik)} matched news')


file1 = "all_news.txt"
file2 = "articles.txt"
file3 = "news_content.txt"
word_file = 'fake_media_words.txt'
matches = find_matches(file1, file2, file3, threshold=0.40)
process_news_and_matches(word_file, matches)

with open('matches.txt', 'w', encoding='utf-8') as file:
    for match in matches:
        file.write(f"{match}\n")
