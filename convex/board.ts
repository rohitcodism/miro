
import { mutation } from './_generated/server';
import { v } from 'convex/values';

const images = [
    "../public/placeholders/1.svg",
    "../public/placeholders/2.svg",
    "../public/placeholders/3.svg",
    "../public/placeholders/4.svg",
    "../public/placeholders/5.svg",
    "../public/placeholders/6.svg",
    "../public/placeholders/7.svg",
    "../public/placeholders/8.svg",
    "../public/placeholders/9.svg",
    "../public/placeholders/10.svg",
    "../public/placeholders/11.svg",
    "../public/placeholders/12.svg",
    "../public/placeholders/13.svg",
    "../public/placeholders/14.svg",
    "../public/placeholders/15.svg",
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