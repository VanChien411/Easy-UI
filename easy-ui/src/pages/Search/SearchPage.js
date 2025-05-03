import React from "react";
import SearchResults from "../../components/ui/Search/SearchResults";
import "./SearchPage.css";

function SearchPage() {
  return (
    <div className="search-page">
      <article>
        <SearchResults />
      </article>
    </div>
  );
}

export default SearchPage; 