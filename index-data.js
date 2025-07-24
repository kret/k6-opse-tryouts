import http from 'k6/http';

export const options = {
    iterations: 1,
    insecureSkipTLSVerify: true,
};

export default function() {
    const params = {
        headers: {
            Authorization: 'Basic YWRtaW46em45eVQoQSY5RkR3UiNMRChASkQ3SDc5XXJqMmdRZEM=',
            'Content-Type': 'application/json',
        },
        compression: 'gzip',
    };

    const createIndexBody = {
        settings: {
            index: {
                number_of_shards: 2,
                number_of_replicas: 1,
            }
        },
        mappings: {
            properties: {
                name: {
                    type: 'keyword',
                },
                age: {
                    type: 'integer',
                }
            }
        }
    }
    http.put('http://localhost:9200/demo', JSON.stringify(createIndexBody), params);
    http.put('https://localhost:9243/demo', JSON.stringify(createIndexBody), params);

    for (let i = 0; i < 1_000_000; i++) {
        const doc = {
            name: Math.random().toString(36),
            age: Math.ceil(Math.random() * 100),
        }
        http.post('http://localhost:9200/demo/_doc', JSON.stringify(doc), params);
        http.post('https://localhost:9243/demo/_doc', JSON.stringify(doc), params);
    }

    const paramsX = {
        headers: {
            Authorization: 'Basic YWRtaW46em45eVQoQSY5RkR3UiNMRChASkQ3SDc5XXJqMmdRZEM=',
            'Content-Type': 'application/x-ndjson',
        },
        compression: 'gzip',
    };
    for (let i = 0; i < 1_000; i++) {
        const docs = [];
        for (let j = 0; j < 1_000; j++) {
            const meta = {
                create: {}
            }
            const doc = {
                name: Math.random().toString(36),
                age: Math.ceil(Math.random() * 100),
            }
            docs.push(JSON.stringify(meta));
            docs.push(JSON.stringify(doc));
        }
        const docsBody = docs.join('\n');
        http.post('http://localhost:9200/demo/_bulk', docsBody, params);
        http.post('https://localhost:9243/demo/_bulk', docsBody, params);
    }
}
