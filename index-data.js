import http from 'k6/http';
import { check } from 'k6';

export const options = {
    iterations: 1,
    insecureSkipTLSVerify: true,
    // httpDebug: 'full',
    throw: true,
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
                    type: 'text',
                    fields: {
                        keyword: {
                            type: 'keyword',
                        }
                    }
                },
                age: {
                    type: 'integer',
                }
            }
        }
    }
    check(http.put('http://localhost:9200/beings', JSON.stringify(createIndexBody), params), {
        'status is 200': val => (res) => res.status === 200,
    });
    check(http.put('https://localhost:9243/beings', JSON.stringify(createIndexBody), params), {
        'status is 200': val => (res) => res.status === 200,
    });
    
    const paramsBulk = {
        headers: {
            Authorization: 'Basic YWRtaW46em45eVQoQSY5RkR3UiNMRChASkQ3SDc5XXJqMmdRZEM=',
            'Content-Type': 'application/x-ndjson',
        },
        compression: 'gzip',
    };
    const meta = JSON.stringify({ create: {} });
    for (let batchNumber = 0; batchNumber < 1_000; batchNumber++) {
        const docs = [];
        for (let docNumber = 0; docNumber < 1_000; docNumber++) {
            const doc = {
                name: (Math.random() < 0.1 ? (Math.random() < 0.5 ? 'Bird ' : 'Mole ') : '') + Math.random().toString(),
                age: Math.ceil(Math.random() * 100),
            }
            docs.push(meta);
            docs.push(JSON.stringify(doc));
        }
        const docsBody = docs.join('\n') + '\n';
        check(http.post('http://localhost:9200/beings/_bulk', docsBody, paramsBulk), {
            'status is 200': val => (res) => res.status === 200,
        });
        check(http.post('https://localhost:9243/beings/_bulk', docsBody, paramsBulk), {
            'status is 200': val => (res) => res.status === 200,
        });
    }
}
