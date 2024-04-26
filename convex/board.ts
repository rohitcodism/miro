import { mutation } from './_generated/server';
import { v } from 'convex/values';

const images = [
    "../assets/placeholders/1.svg",
    "../assets/placeholders/2.svg",
    "../assets/placeholders/3.svg",
    "../assets/placeholders/4.svg",
    "../assets/placeholders/5.svg",
    "../assets/placeholders/6.svg",
    "../assets/placeholders/7.svg",
    "../assets/placeholders/8.svg",
    "../assets/placeholders/9.svg",
    "../assets/placeholders/10.svg",
    "../assets/placeholders/11.svg",
    "../assets/placeholders/12.svg",
    "../assets/placeholders/13.svg",
    "../assets/placeholders/14.svg",
    "../assets/placeholders/15.svg",
]

export const create = mutation(
    {
        args: {
            orgId: v.string(),
            title: v.string()
        },
        handler: async(ctx, args) => {
            const identity = await ctx.auth.getUserIdentity();

            console.log("Create Mutation Called!!");

            if(!identity){
                throw new Error("Unauthorized!!");
            }
            const randomImage = images[Math.floor(Math.random() * images.length)];

            const board = await ctx.db.insert("boards",{
                title: args.title,
                orgId: args.orgId,
                authorId: identity.subject,
                authorName: identity.name || "",
                imageUrl: randomImage
            });
            console.log("Board created successfully!!");
            return board;
        },
    }
)