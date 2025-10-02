---
layout: post
title: One more AI agent and you'll be Clairvoyant, I promise.
date: 2025-10-01 12:00:00-0400
description: Building Clairvoyant - a real-time voice transcription and intelligent context-aware assistant for AR glasses that captures audio, processes it through AI agents, and provides personalized responses.
related_posts: false
giscus_comments: false
tags: ar ai agents clairvoyant voice transcription memory
categories: machine-learning-posts
pretty_table: true
toc:
    beginning: true
---

> **Clairvoyance**
> /ˌklerˈvoiən(t)s/
> *noun*
> The supposed faculty of perceiving things or events beyond normal sensory contact.

I'm fascinated by the idea of clairvoyance. The word itself literally means "clear-seeing." In modern usage, it's tied to paranormal or spiritual vision, and pop culture often reduces it to pre-cognition. Ancient texts, however, describe clairvoyance as God's domain: retro-cognition and extrasensory perception. From the Vedas to the Bible to Islamic writings, humanity has been handed a playbook for aspiring to reflect the divine. Who could've guessed that thousands of years later the reconstruction of Jehovah's sand in the form of Jensen's GPU would be the means to make it all possible? *Yaas queen*, we're talking AI wrappers, let's gooo!

## What did I make? 

Clairvoyant is a real-time voice transcription and intelligent context-aware assistant. It captures audio, transcribes it as text, processes it through multiple cascades of AI agents, and then provides personalized responses using multiple AI tools to pass informative context back to the user's wave-guide optics HUD. During this process, Clairvoyant simultaneously captures all transcribed audio and adds it to memory. Over time, the user can [achieve 20/20 hindsight](https://youtu.be/JrGYLNHfUwE?si=GDZbjTGA7rdpwqGG) 

![image](https://with-context-public.s3.us-east-1.amazonaws.com/internal-memory-documents/2025/10/948c117ffc7e3806075f079f43823df8.gif)

and recall from their memories things that matter to them. I've found it useful to remember things that I said, things that I've heard, and reflection on the questions I've asked about over a growing number of weeks and months. In short, I'm getting closer to my vision of having E.D.I.T.H, JARVIS, and Cortana. 

>💬 **Show me the code**
> 
>🤖 You're absolutely right, [here's the code](https://github.com/ajay-bhargava/clairvoyant). 

## My software design philosophy in AI Glasses

Clairvoyant is my first real flex at making a highly opinionated codebase following my time at the [Fractal Accelerator of NYC](https://fractalbootcamp.com). [Grokking Simplicity](https://www.amazon.com/Grokking-Simplicity-software-functional-thinking/dp/1617296201) and [Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)teach core fundamentals of designing great code and are required reading in the accelerator. I've felt, however, that with traditional applications of programming (e.g. ML code or Full-stack Engineering) you've got to obey the primitives or abstractions that others [have designed for you](https://www.reddit.com/r/nextjs/comments/1ag76t0/nextjs_14_vs_pages_meme/). Because of this, you're not really thinking about the "business logic" and rather thinking about "integration patterns" and that isn't terribly satisfying.

What's fun in AR/AI glasses is that the whole field is still very greenfield. While there are growing codebases to support hardware, the design philosophy of how software programs should be written isn't really there yet. I think that the extensibility of software in the AI glasses domain could be greatly enhanced *if* we all started forming (and writing) opinions and thoughts on how code should "work" in this paradigm and then debated them. So, without further ado, here are some design principles I learned through real-world testing the Clairvoyant app (and building AR glasses software) for the last 3 months. 

### Write API's for hardware access, boost iteration speed.

I've worked with the Brilliant Frames in the past. In fact, I was the [fan favorite](https://x.com/0x1F9ED/status/1936792737774288967) in a Hackathon in NYC because of my ability to create apps that mattered quickly on that platform. That being said, creating upon the [Flutter](https://github.com/CitizenOneX/frame_vision_api) repository template didn't feel super intuitive. It "*worked*" because the majority of the application I created was a backend [API hosted in Convex](https://github.com/with-context-engine/context-personhood) and this did all the heavy lifting. It received image data from the app which knew about the API endpoint and then the API endpoint logic handled most of the image interpretation. Now, smart readers will know that Convex is dripping [WebSockets](https://stack.convex.dev/how-convex-works)so that you can get insanely low latency transactions between your service and the client. In my case, the API endpoint was designed to receive image data, but it could've easily been adapted to audio and haptic/IMU data too. 

### Stay away from Swift. Use platforms that house your AI glasses app instead. 

The underlying hardware code had been graciously written by [the Brilliant team](https://docs.brilliant.xyz/frame/frame-sdk-lua/)so it was only a matter of effort to get the full glasses integration. The hard part wasn't actually developing the API endpoint. What slowed me down wasn't the API or the hardware. It was wrestling with Flutter, packaging builds in Xcode, pushing to TestFlight, and debugging code that didn't really matter to what I was building. Between July and August 2025 I thought for a hot minute, whoa, I think there should be a startup to write infrastructure "glue" that standardizes connections between hardware (client) and server. Turns out, however, [MentraOS](https://docs.mentra.glass/quickstart) (formerly AugmentOS) has already existed for years and did just that! The primitive to deal with audio, for example, is high touch enough that you get a VAD model to transcribe the audio into text without having to worry about doing that yourself. They use [Soniox](https://soniox.com) as their audio translation provider. This is all it takes, for example, to get the spoken text from the user or anyone around him as he/she is wearing AR glasses. With MentraOS, you're not building apps for the Apple App Store, you're building apps for the MentraOS app store. I'm still in awe with how Apple approved this. 

```typescript
// Subscribe to transcription events
appSession.events.onTranscription((data) => {
  console.log(`Transcription: ${data.text}`);
  console.log(`Final: ${data.isFinal}`);

  if (data.isFinal) {
  }
});
```

### Mind your latency 

In my early prototypes of Clairvoyant, I would wantonly call AI tools and have my daily audio transcription acted on as soon as I'd be done speaking. Depending on the latency of the AI tool, this would either be super annoying, or super frustrating. Allow me to how I think about latency and control-flow in the age of AI glasses. 

**"Be Fast" expectations**

I have a theory. The closer software gets to our eyeballs, the less patience people have to it taking too long to "work". Two people staring at an iPhone loading a webpage? Totally fine! A person waiting a second on his glasses for the weather, or, the subsequent return to an answer to a query about the "role of context engineering in LLM's"? Preposterous, its taking too god-damn long! 

**"Be Slow" expectations**

Is the text appearing too fast? You'll hear your inner monologue say: "What's going on here? Is this thing even working?". As a developer, even you'll have a pause for concern: Hang on I'm not sure this answer really searched the web, or utilized agentic memory correctly.  Gleaning the pace at which users will "expect" answers is an acquired taste. 

Since I've been wearing Clairvoyant for about a month now I've had some thoughts as to how to address latency. How do we strike the right balance? 

#### Don't listen to everything you hear

Right off the bat we have to start with preventing erroneous audio chunks from making their way into the `handleTranscription()` flow. This allows you to reserve your AI inference server for queries that matter. This is accomplished by three methods: 

1. Making sure that the VAD model (Soniox) is notifying the application that the speech is done. Soniox claims to use intonation, breath, and other audio characteristics to determine the completion of speech. Since I haven't invested time and energy into developing better Mel Frequency Cepstral Coefficents tooling (see [here](https://www.kaggle.com/code/ilyamich/mfcc-implementation-and-tutorial) for more information on that) I'm just going to rely on the out of the box service for now. 

2. Making sure that the duration of the transcribed speech isn't a sentence fragment or a spurious audio fragment. You'll be surprised how sometimes sensitive or not sensitive (e.g. finicky) microphones can be. With that there are spurious detections of speech, spurious transcriptions and those happen to be quite short. Eliminating them is a good idea. 

3. Sometimes you'll ask one or two or maybe three successive questions one after another. Or maybe you're in a crowded room of excited people who are rapid firing questions at you. A simple `rateLimiter` is useful for preventing too many queries and thus too many displays on the glasses all at once. 

```typescript
protected override async onSession(session: AppSession): Promise<void> {
		const [memorySession, peers] = await initializeMemory();

		session.events.onTranscription(async (data) => {
			// [1] If its not a final utterance, skip
			if (!data.isFinal) return;

			// [2] If the audio segment causing this transcription is too short, skip
			if (data.duration) {
				if (data.duration < 200) {
					return;
				}
			}

			// [3] If the question rate limiter is triggered, skip
			if (this.questionRateLimiter.shouldSkip(session.logger, "Clairvoyant")) {
				return;
			}

			// Handle the transcription
			await handleTranscription(data, session, memorySession, peers);
		});
	}
```

#### Use lightning fast AI models for your AI agents

There are 6 agents that handle transcribed text. Iterating through different providers and prompts has been super delightful thanks to [BAML](https://boundaryml.com)(more on this [[#Use lightning fast AI models for your AI agents|here]]). 

```bash
baml_src/
├── route.baml          # Main routing logic and route definitions
├── weather.baml        # Weather response agent
├── search.baml         # Web search result agent  
├── maps.baml           # Location/maps response agent
├── recall.baml         # Memory recall agent
├── answer.baml         # General knowledge agent
├── clients.baml        
└── generators.baml     
```

Crucially, however, its necessary to choose the fastest and lowest latency AI models to interpret text. Fortunately you can do this via BAML in the `clients.baml` settting. I ended up choosing `GPT-OSS-20B` and/or `GPT-OSS-120B` depending on the complexity or ambiguity of the query that was sent to that particular agent. 

```
client<llm> Groq {
  provider openai-generic
  options {
    base_url "https://api.groq.com/openai/v1"
    api_key env.GROQ_API_KEY
    model "openai/gpt-oss-20b"
  }
}

client<llm> GroqHeavy {
  provider openai-generic
  options {
    base_url "https://api.groq.com/openai/v1"
    api_key env.GROQ_API_KEY
    model "openai/gpt-oss-120b"
  }
}
```

Outside of those AI models sped up on [Groq](https://groq.com) using Groq's [LPU](https://groq.com/lpu-architecture)'s I never dabble in any of the current generation models because they're so god awfully slow. The only model that actually feels fast that isn't hosted by Groq is `openai/gpt-4o-mini` and I provide that agent with highly structured weather data to interpret weather requests. 

#### Use fast AI tools

Every tool that touches text must be fast. This is because you're operating in so many compounding latency constraints. Audio transcription: latency. The AI agent that routes your query to the other AI agent: latency. The receipt of the text back to the glasses following the tool interpretation agent massaging returned tool data: latency. 

Latency is everywhere, and so selecting the right tooling frameworks that deliver what you need fast without fail is of the highest concern. With that in mind, here are the tool providers I used for each data source: 

| Tool        | Provider                                                                                                         | Latency (ms) |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ------------ |
| Web Search  | [Tavily](https://www.tavily.com)                                                                                 | ~600ms       |
| Maps Search | Google Maps ([Text Search API](https://developers.google.com/maps/documentation/places/web-service/text-search)) | ~400ms       |
| Weather     | [OpenWeatherMap](https://openweathermap.org)                                                                     | ~300ms       |
| Memory      | [Plastic Labs](https://plasticlabs.ai/#main)                                                                     | ~1200ms      |

### Temper user frustration of latency with loading hints

I know it sounds really simple, but a really easy design choice you can make on the Even Realities G1's is to provide the user with text while another function is awaiting return. Here's what that looks like: 

```typescript
import { type AppSession, ViewType } from "@mentra/sdk";

export async function showTextDuringOperation<T>(
	session: AppSession,
	loadingText: string,
	doneText: string,
	errorText: string,
	asyncOperation: () => Promise<T>,
	options: {
		view?: ViewType;
		clearDurationMs?: number;
	} = {},
): Promise<T> {
	const { view = ViewType.MAIN, clearDurationMs = 5000 } = options;

	session.layouts.showTextWall(loadingText, {
		view,
		durationMs: 30000,
	});

	try {
		const result = await asyncOperation();

		session.layouts.showTextWall(doneText, {
			view,
			durationMs: clearDurationMs,
		});

		return result;
	} catch (error) {
		session.layouts.showTextWall(errorText, {
			view,
			durationMs: clearDurationMs,
		});
		throw error;
	}
}

```

and here's what it looks like in operation: 

```typescript
const response = await showTextDuringOperation(
	session,
	"// Clairvoyant\nR: Trying to remember...",
	"// Clairvoyant\nR: Got it!",
	"// Clairvoyant\nR: Couldn't remember!",
	() => diatribePeer.chat(textQuery),
);
```

The reason why this is so helpful is that some applications are indeed slow and that's because they're grooming over a ton of contextual data to sound relevant. By displaying something to the user during the load of another screen, you quell the user's frustrations. The real trick is, I think, matching the user's expectations with the reality for what the AI tool or AI agent is intending to do. Calling on your personal memory layer? "Trying to Remember.". Looking up something on the internet? "Searching the web.". Fun cues to make the user feel engaged with a real assistant are always helpful. 

## Advice for vibe coding a personal assistant

In designing Clairvoyant, I first did a lot of nonsense. I had page long vibe codes, tools mixed in with agents, and just more slop than you could think of. This was actually really useful because it let me sink into the trough of enlightenment as to how I'd want to make repeatable code modules that could be defined and refined. Here are some of the fundamentals I laid down having spent far too many tokens messing around. 

#### Create a router that an LLM can expand upon

One of the early design challenges I faced was how to create an extensible foundation upon which I could build additional tools without having to constantly rework the software architecture. The `switch` statement and good types to the rescue! 

```typescript
export async function handleTranscription(
	data: TranscriptionData,
	session: AppSession,
	memorySession: Session,
	peers: Peer[],
) {
	session.logger.info(`[Clairvoyant] Transcription: ${data.text}`);
	const routing = await b.Route(data.text);
	if (!routing.routing) {
		session.logger.warn(`[Clairvoyant] No routing decision made. Resetting...`);
		return;
	}
	switch (routing.routing) {
		case Router.WEATHER:
			session.logger.info(`[Clairvoyant] Weather route: starting async flow`);
			void startWeatherFlow(session);
			return;

		case Router.MAPS:
			session.logger.info(`[Clairvoyant] Maps route: starting async flow`);
			void startMapsFlow(data.text, session, memorySession, peers);
			return;

		case Router.WEB_SEARCH:
			session.logger.info(
				`[Clairvoyant] Web search route: starting async flow`,
			);
			void startWebSearchFlow(data.text, session, memorySession, peers);
			return;

		case Router.KNOWLEDGE:
			session.logger.info(`[Clairvoyant] Routing: Starting knowledge flow`);
			void startKnowledgeFlow(data.text, session, memorySession, peers);
			return;

		case Router.MEMORY_RECALL:
			session.logger.info(
				`[Clairvoyant] Memory Recall route: starting async flow`,
			);
			void MemoryRecall(data.text, session, memorySession, peers);
			return;

		default: {
			session.logger.info(
				`[Clairvoyant] Memory Insertion route: starting async flow`,
			);
			void MemoryCapture(data.text, session, memorySession, peers);
			return;
		}
	}
}
```

These are defined by an `Enum` in BAML that allows an LLM (in this case `gpt-oss-120b`) to intelligently decide how to route the user query to the right tool call to get the user's query resolved. 

```
enum Router {
    WEATHER @description("Current or upcoming weather questions for a specific place.")
    WEB_SEARCH @description("News, current events, facts that change over time such as political events, or topics not obviously location-based.")
    MAPS @description("Finding nearby businesses, restaurants, addresses, or directions.")
    KNOWLEDGE @description("General knowledge that does not fit into other categories.")
    MEMORY_RECALL @description("Questions about the user's memory and personal history, personal preferences, personal opinions, goals, information about the user, or anything that is not a fact.")
}

class RoutingBehavior {
    origin string @description("Echo of the user's input text verbatim.")
    routing Router
}

function Route(text: string) -> RoutingBehavior {
    client "GroqHeavy"
    prompt #"
        You are a routing assistant. Pick the best router for the user's request.
        {{ _.role("user") }} {{ text }}
        {{ ctx.output_format }}
    "#
}
```

Now, one thing I will say is relying on an LLM to route natural language queries can be fraught with a ton of error, but, fortunately, with BAML you can just *test* your AI agents! 

##### Use BAML for defining your AI agents. That's it.

I cannot stress this enough. The ability to have clean types that match the structured output from an LLM means that you can develop tests. I use `baml` included test suite to test a battery of queries every time I change my system or assistant prompt. Even if there were to be a model change, I flag on deployment. 

```baml
test test_weather {
    functions [Route]
    args {
        text "What is the weather in San Francisco?"
    }
    @@assert( {{ this.routing == "WEATHER"}})
}

test test_web_search {
    functions [Route]
    args {
        text "Who is the current president of the United States?"
    }
    @@assert( {{ this.routing == "WEB_SEARCH"}})
}

test test_maps {
    functions [Route]
    args {
        text "Find me a ramen restaurant near Union Square."
    }
    @@assert( {{ this.routing == "MAPS"}})
}

test test_knowledge {
    functions [Route]
    args {
        text "What is the capital of France?"
    }
    @@assert( {{ this.routing == "KNOWLEDGE"}})
}

test test_knowledge_2 {
    functions [Route]
    args {
        text "What is the purpose of mitochondria?"
    }
    @@assert( {{ this.routing == "KNOWLEDGE"}})
}

test test_memory {
    functions [Route]
    args {
        text "What is my name?"
    }
    @@assert( {{ this.routing == "MEMORY_RECALL"}})
}

test test_memory_2 {
    functions [Route]
    args {
        text "Koyal, what did I eat yesterday?"
    }
    @@assert( {{ this.routing == "MEMORY_RECALL"}})
}
```

#### Create a separation of concerns for your tools with handlers

<img src="https://with-context-public.s3.us-east-1.amazonaws.com/internal-memory-documents/2025/10/382aca351e6ee17234d581ebc05493b4.png" alt="image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">

In all the subsequent applications I've developed, I've maintained the pattern where handlers call tools. Like tools, AI agents are handled by the handler. That way they are constrained by the control flow. See the example below: 

```typescript
export async function startWebSearchFlow(
	query: string,
	session: AppSession,
	memorySession: Session,
	peers: Peer[],
) {
	const runId = Date.now();
	webSearchRunIds.set(session, runId);

	session.logger.info(
		`[startWebSearchFlow] Starting web search flow for query: ${query}`,
	);
	
	// [1] Try the WebSearchTool
	try {
		const searchResults = await showTextDuringOperation(
			session,
			"// Clairvoyant\nS: Searching the web...",
			"// Clairvoyant\nS: Found it!",
			"// Clairvoyant\nS: Couldn't search the web.",
			() => performWebSearch(query),
		);
		
		// [2] Capture in Memory Tool
		await MemoryCapture(query, session, memorySession, peers);

		if (!searchResults) {
			throw new Error("No response from web search");
		}

		if (webSearchRunIds.get(session) !== runId) {
			session.logger.info(
				`[startWebSearchFlow] Web search response arrived for stale request, discarding`,
			);
			return;
		}
		
		
		// [3] AI agent handling WebSearchResults
		const answerLines = await b.AnswerSearch(query, searchResults);

		if (webSearchRunIds.get(session) !== runId) {
			session.logger.info(
				`[startWebSearchFlow] Web search response arrived for stale request, discarding`,
			);
			return;
		}

		const lines = answerLines.results[0]?.lines;
		
		// [4] Display Text on AI glasses
		if (lines?.length) {
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				if (webSearchRunIds.get(session) !== runId) return;
				session.logger.info(`[startWebSearchFlow] Web search result: ${line}`);
				session.layouts.showTextWall(`// Clairvoyant\nS: ${line}`, {
					view: ViewType.MAIN,
					durationMs: 3000,
				});
				if (i < lines.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, 3000));
				}
			}
		} else {
			session.logger.error(`[startWebSearchFlow] No lines in answerLines`);
		}
	} catch (error) {
		session.logger.error(
			`[startWebSearchFlow] Web search flow error: ${String(error)}`,
		);

		if (webSearchRunIds.get(session) === runId) {
			session.layouts.showTextWall(
				"// Clairvoyant\nS: Couldn't search the web.",
				{
					view: ViewType.MAIN,
					durationMs: 3000,
				},
			);
		}
	}
}
```

### Then write `AGENTS.md` and/or `./cursor/rules` 

Ok, now the part you're probably interested in. Surprise, the lesson here is a little boring, tbh. If you want a great time vibe-coding, you're going to need to have a ton of structure to your code. If you've made it this far in the blog you're probably already aware of this. If you're skipping around, sorry, you're going to have to go back and read the first few sections! Its true. When the code was well structured (or at least, structured enough such that there was a clear separation of concerns between the code modules) it was far easier to just tell a code generation model that I needed to integrate yet another tool with an existing handler pattern. Once I wrote the knowledge tool, the search tool and the maps tool were pretty simple. The handlers are all about the same. Memory (to be discussed later) was even easier because it just had to be inserted between query and response generation.  

### Accelerate using CLI or background agents 

I will say that tools like [Amp](http://www.ampcode.com)are amazing to achieve terminal velocity in adding new features once you've got the design pattern down. Not entirely sure why that is, but, I think it has to do with the efficient use of the context window and the ability to run command line tools and git with far better ease than in IDE. What I particularly like about Amp is that I can paste the contents of the conversation by sharing it. 

## What excites me moving forward?

### Personal memory and memory reasoning

My most recent edit to Clairvoyant has been to add [Honcho](https://honcho.dev). Honcho is a dead simple method of way of embedding memory and reasoning into any application. It was one tool call, one handler, and one insertion into every existing handler to capture both the user's vocal "diatribe" and a "synthesis" peer. I think of peers as the Agent's shadow. They're there to passively listen in on a conversation between you and the AI agent or the AI agents and other agents. Creating new peers is as simple as this: 

```typescript
export async function initializeMemory(): Promise<[Session, Peer[]]> {
	const honchoClient = new Honcho({
		apiKey: env.HONCHO_API_KEY,
		environment: "production",
		workspaceId: "with-context",
	});
	// [1] Create a session
	const session = await honchoClient.session(randomUUID());
	// [2] Create the peer(s)
	const diatribePeer = await honchoClient.peer("diatribe", {
		metadata: {
			name: "Diatribe",
			description:
				"A peer that listens to the raw translations of the users' speech.",
		},
	});
	const synthesisedPeer = await honchoClient.peer("synthesis", {
		metadata: {
			name: "Synthesis Peer",
			description:
				"A peer that captures synthesiszed  knowledge from the user's speech.",
		},
	});
	// Add the peers to the session
	await session.addPeers([diatribePeer, synthesisedPeer]);
	return [session, [diatribePeer, synthesisedPeer]];
}
``` 

Instantiating the session happens (in my case) at every time the user turns on the Clairvoyant application in MentraOS. The memory session is then passed to every handler and every tool that needs it. God I love typescript so much!  

```typescript
	protected override async onSession(session: AppSession): Promise<void> {
		const [memorySession, peers] = await initializeMemory();
		// Other code
		...
	}
```

Now, when the individual asks a question (say, "What's my name") the LLM router will intelligently route this back to the `MEMORY_RECALL` handler and then call a memory recall command, which, under the hood is just a wrapper for the API endpoint that Honcho has created. 

```typescript
export async function MemoryRecall(
	textQuery: string,
	session: AppSession,
	memorySession: Session,
	peers: Peer[],
) {
	const runId = Date.now();
	memoryRunCallIds.set(session, runId);

	session.logger.info(`[startMemoryRecallFlow] Starting memory recall flow`);

	try {
		const diatribePeer = peers.find((peer) => peer.id === "diatribe");
		if (diatribePeer) {
			// [1] Capture the query as a memory first
			await memorySession.addMessages([
				{
					peer_id: diatribePeer.id,
					content: textQuery,
					metadata: {
						timestamp: new Date().toISOString(),
						source: "memoryRecall",
					},
				},
			]);

			// [2] Query Honcho's representation of your memory from a peer. 
			const response = await showTextDuringOperation(
				session,
				"// Clairvoyant\nR: Trying to remember...",
				"// Clairvoyant\nR: Got it!",
				"// Clairvoyant\nR: Couldn't remember!",
				() => diatribePeer.chat(textQuery),
			);
			if (response) {
				if (memoryRunCallIds.get(session) !== runId) {
					session.logger.info(
						`[startMemoryRecallFlow] Response arrived for stale request, discarding`,
					);
					return;
				}
				
				// [3] Format that memory response for the glasses. 
				const memoryRecall = await b.MemoryQueryRecall(textQuery, response);

				if (memoryRunCallIds.get(session) !== runId) {
					session.logger.info(
						`[startMemoryRecallFlow] Response arrived for stale request, discarding`,
					);
					return;
				}

				// [4] Process the memory recall results for the glasses
				if (
					memoryRecall.results?.lines &&
					memoryRecall.results.lines.length > 0
				) {
					const lines = memoryRecall.results.lines;

					// Display each line sequentially
					for (let i = 0; i < lines.length; i++) {
						const line = lines[i];


						if (memoryRunCallIds.get(session) !== runId) return;

						session.logger.info(
							`[startMemoryRecallFlow] Memory recall line: ${line}`,
						);
						session.layouts.showTextWall(`// Clairvoyant\nR: ${line}`, {
							view: ViewType.MAIN,
							durationMs: 3000,
						});

						// Add delay between lines (except for the last line)
						if (i < lines.length - 1) {
							await new Promise((resolve) => setTimeout(resolve, 3000));
						}
					}
				} else {
					session.logger.error(
						`[startMemoryRecallFlow] No lines in memory recall results`,
					);
					if (memoryRunCallIds.get(session) === runId) {
						session.layouts.showTextWall(
							"// Clairvoyant\nR: No memories found.",
							{
								view: ViewType.MAIN,
								durationMs: 2000,
							},
						);
					}
				}
			}
		}
	} catch (error) {
		session.logger.error(
			`[startMemoryRecallFlow] Error recalling memory: ${error}`,
		);
		if (memoryRunCallIds.get(session) === runId) {
			session.layouts.showTextWall("// Clairvoyant\nR: Couldn't remember!", {
				view: ViewType.MAIN,
				durationMs: 2000,
			});
		}
	}
}
```

What's really impressive is that in the default route where no tool is called, almost all the conversation that I'm having is being logged into memory. I now understand why tools like [friend](friend.com), [taya](https://tayanecklace.com)and i'm sure a litany of others all have some form of appeal. Its simple, being able to recall with perfect clarity what you said (or what others have said) is of high value to people. I know I'd like to win every argument with my wife! 

### Devices with beam forming microphones

I'm not an audio specialist but I do have enough of a physics understanding to appreciate the need to perform the necessary signal processing to amplify the "target"'s voice and separate it from the noise. In this sense, the G1's are not a sufficiently good device. I'm hopeful, however, that as the hardware progresses there will be the ability to add multiple microphones and then perform the signal processing on device to clear up the speaker's intended sound. Sometimes when I want to be really crisp in what I'm recording, I'll just wear my Airpods and my glasses and the voice capture and transcription becomes instantly better. 

### Improving latency in AI models

I think we're finally out of the trough of llusion for transformer architecture based models. Owing to vLLM's coming through, we're no longer sitting around for minutes waiting for the LLM to give us back an answer. Soon, this will be fast, in under 1s, and feel snappy. I am hopeful that there will be more attention to this domain in 2026.

### Diarization

Even if we could just have self versus other in a latency sensitive way, that would be pretty cool. I'm thinking through how to support diarization. Something like an onboarding to capture the vocal data and have that as a check before sending data to a VAD model would be kind of neat. Of course, the ecosystem in Mentra and Soniox would have to be better resolved to support this. 

### Shared human memory

This work has got me thinking about memory at a deeper level. What if AI glasses become democratized? If everyone had memory embedded into their glasses, then could we all just have access to each other's memory? Could we create a "hivemind" type experience where AI becomes the propagator of shared intuition, reasoning, and understanding? More on this when the time is right! 

![image](https://with-context-public.s3.us-east-1.amazonaws.com/internal-memory-documents/2025/10/061f8410b0ae1ad37c390f5cec46881e.png)

## Conclusion

Clairvoyant started with a curiosity about an old word and turned into a real system for clear-seeing. It takes audio, turns it into text, routes that text through agents, and pushes context back into the HUD. The hard part hasn't been the models or the hardware. It has been about speed, structure, and design choices that make the experience feel natural. Latency, memory, and routing are not abstract problems here, they are the core of making the assistant actually useful. If ancient clairvoyance was about touching something beyond human reach, the modern version is about capturing what we said, what we heard, and what we want to remember. The real work is in writing opinionated code, testing agents, separating tools from handlers, and making patterns that other developers can build on. It is time to lock in and build the software foundations now so that when the glasses get better and the models get faster, the system already feels like second nature.
