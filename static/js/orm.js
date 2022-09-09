class Idb {
	constructor(dbName, dbVersion, upgradeCallback) {
		this.dbName = dbName;
		this.dbVersion = dbVersion;
		this.upgradeCallback = upgradeCallback;
	}

	async init() {
		this.db = await this.open(this.dbName, this.dbVersion, this.upgradeCallback);
		return this;
	}

	open(dbName, version, upgradeCallback) {
		return new Promise((resolve, reject) => {
			if (!window.indexedDB) {
				console.error(`Your browser doesn't support IndexedDB`);
				return;
			}
			const request = indexedDB.open(dbName, version);

			request.onsuccess = (event) => {
				const db = event.target.result;
				resolve(db);
			}

			request.onerror = (event) => {
				reject(`Database error: ${event.target.errorCode}`);
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (upgradeCallback) {
					upgradeCallback(db, event.oldVersion);
				} else {
					console.error(dbName + " upgrade callback not provided");
				}
			};
		});
	}

	openCursor(storeName) {
		return new Promise((resolve, reject) => {
			const txn = this.db.transaction(storeName, "readonly");
			const objectStore = txn.objectStore(storeName);
			var values = new Map();
			objectStore.openCursor().onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					values.set(cursor.key, cursor.value);
					cursor.continue();
				}
			};

			txn.oncomplete = function () {
				resolve(values);
			};
		});
	}

	insert(storeName, value, key) {
		return new Promise((resolve, reject) => {
			const txn = this.db.transaction(storeName, 'readwrite');

			const store = txn.objectStore(storeName);
			var query;
			if (key) {
				query = store.put(value, key);
			} else {
				query = store.put(value);
			}

			query.onsuccess = function (event) {
				resolve([event.target.result, value ]);
			};

			query.onerror = function (event) {
				reject(event.target.errorCode);
			}
		});
	}

	get(storeName, key) {
		return new Promise((resolve, reject) => {
			const txn = this.db.transaction(storeName, 'readonly');
			const store = txn.objectStore(storeName);

			let query = store.get(key);

			query.onsuccess = (event) => {
				if (!event.target.result) {
					console.trace();
					reject(`The value with key ${key} not found`);
				} else {
					const value = event.target.result;
					resolve(value);
				}
			};
		});
	}

	count(storeName) {
		return new Promise((resolve, reject) => {
			const txn = this.db.transaction(storeName, 'readonly');
			const store = txn.objectStore(storeName);

			let query = store.count();
			query.onsuccess = (event) => {
				resolve(query.result);
			};
		});
	}

	delete(storeName, key) {
		return new Promise((resolve, reject) => {
			const txn = this.db.transaction(storeName, 'readwrite');
			const store = txn.objectStore(storeName);
			let query = store.delete(key);

			query.onsuccess = function (event) {
				console.log("Deleted ", key)
				resolve();
			};

			// handle the error case
			query.onerror = function (event) {
				reject(event);
			}
		});
	}

	async fetchTemplateToStore(templateUri, storeName) {
		const storeCount = await this.count(PLANNING_STORE_NAME);
		if (storeCount == 0) {
			await fetch(templateUri)
				.then(response => {
					return response.json();
				})
				.then(planningFile => this.populateStoreFromTemplate(storeName, planningFile));
		}
	}

	populateStoreFromTemplate(storeName, planningFile) {
		for (const [key, value] of Object.entries(planningFile)) {
			this.insert(storeName, value, key);
		}
	}
}

//-------------------------- PLANNING SPECIFIC LOGIC --------------------------//
//-------------------------- USED FROM MULTIPLE JS ----------------------------//
const PLANNING_STORE_NAME = 'Planning';
const PLANNING_TEMPLATE_URI = 'static/js/Planning.json';
function upgradePlanningDatabase(db, oldVersion) {
	if (oldVersion == 0) {
		let store = db.createObjectStore('Planning', { autoIncrement: true });
		store.createIndex('byType', 'type', { unique: false });

		return;
	}
}