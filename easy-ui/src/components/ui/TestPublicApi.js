import React, { useState } from 'react';
import { fetchUIComponentsAll } from '../../services/uiComponentsService';
import { fetchCategories } from '../../services/categoriesService';
import { fetchTags } from '../../services/tagsService';
import { fetchComments } from '../../services/commentsService';
import { fetchAboutUs } from '../../services/aboutUsService';
import articleService from '../../services/articleService';

function TestPublicApi() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testApi = async (apiName, apiCall) => {
    setLoading(prev => ({ ...prev, [apiName]: true }));
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [apiName]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({ ...prev, [apiName]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [apiName]: false }));
    }
  };

  const apiTests = [
    {
      name: 'UI Components',
      test: () => fetchUIComponentsAll(1, 5)
    },
    {
      name: 'Categories',
      test: () => fetchCategories()
    },
    {
      name: 'Tags',
      test: () => fetchTags()
    },
    {
      name: 'Articles',
      test: () => articleService.getAll(1, 5)
    },
    {
      name: 'About Us',
      test: () => fetchAboutUs()
    },
    {
      name: 'Comments (component 1)',
      test: () => fetchComments(1)
    }
  ];

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h3>Test Public APIs</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Test các API public không cần authentication
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
        {apiTests.map(({ name, test }) => (
          <div key={name} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
            <h4>{name}</h4>
            <button
              onClick={() => testApi(name, test)}
              disabled={loading[name]}
              style={{
                padding: '8px 16px',
                backgroundColor: loading[name] ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading[name] ? 'not-allowed' : 'pointer',
                marginBottom: '10px'
              }}
            >
              {loading[name] ? 'Testing...' : 'Test API'}
            </button>
            
            {results[name] && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: results[name].success ? '#d4edda' : '#f8d7da',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>{results[name].success ? '✅ Success' : '❌ Error'}:</strong>
                <pre style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>
                  {results[name].success 
                    ? JSON.stringify(results[name].data, null, 2)
                    : results[name].error
                  }
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestPublicApi;
