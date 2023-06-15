'use client';
import {useEffect, useState} from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({data, handleTagClick}) => {
    console.log(data);
    return (
        <div className="mt-16 prompt_layout">
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    );
};

const Feed = () => {
    const [posts, setPosts] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [searchTimeOut, setSearchTimeOut] = useState(null);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/prompt');
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);


    const filterPrompts = (valueOfSearch) => {
        const rgx = new RegExp(valueOfSearch, 'i');
        return posts.filter((post) =>
            rgx.test(post.creator.username) ||
            rgx.test(post.tag) ||
            rgx.test(post.prompt)
        );
    };
    const filterPromptsByTagName = (valueOfSearch) => {
        const rgx = new RegExp(valueOfSearch, 'i');
        return posts.filter((post) =>
            rgx.test(post.tag) 
        );
    };
    
    const handleSearchChange = (e) => {
        clearTimeout(searchTimeOut);

        setSearchText(e.target.value);

        setSearchTimeOut(
            setTimeout(() => {
                const results = filterPrompts(e.target.value);
                setSearchResult(results);
            }, 500)
        );
    };

    const handleTagClick = (tagName) => {
        setSearchText(tagName);
        const results = filterPromptsByTagName(tagName);
        setSearchResult(results);
    };

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search For a tag or a username"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>
            {searchText ? (
                <PromptCardList data={searchResult} handleTagClick={handleTagClick} />
            ) : (
                <PromptCardList data={posts} handleTagClick={handleTagClick} />
            )}
        </section>
    );
};

export default Feed;