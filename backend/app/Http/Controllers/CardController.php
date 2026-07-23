<?php

namespace App\Http\Controllers;

use App\Models\BoardList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;
use Illuminate\Http\Request;

class CardController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, BoardList $list)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'nullable|integer',
            'due_date' => 'nullable|date',
        ]);

        if (!isset($validated['position'])) {
            $validated['position'] = $list->cards()->count();
        }

        $card = $list->cards()->create($validated);

        $card->load(['tags', 'members']);

        return response()->json($card, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Card $card)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'list_id' => 'sometimes|required|exists:lists,id',
            'position' => 'sometimes|required|integer',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'members' => 'nullable|array',
            'members.*' => 'exists:members,id',
        ]);

        $card->update($validated);

        if ($request->has('tags')) {
            $card->tags()->sync($request->input('tags', []));
        }

        if ($request->has('members')) {
            $card->members()->sync($request->input('members', []));
        }

        $card->load(['tags', 'members']);

        return response()->json($card);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Card $card)
    {
        $card->delete();
        return response()->json(null, 204);
    }

    /**
     * Attach a tag to the card.
     */
    public function attachTag(Request $request, Card $card)
    {
        $validated = $request->validate([
            'tag_id' => 'required|exists:tags,id',
        ]);

        $card->tags()->syncWithoutDetaching([$validated['tag_id']]);
        
        return response()->json($card->load(['tags', 'members']));
    }

    /**
     * Detach a tag from the card.
     */
    public function detachTag(Card $card, Tag $tag)
    {
        $card->tags()->detach($tag->id);
        
        return response()->json($card->load(['tags', 'members']));
    }

    /**
     * Assign a member to the card.
     */
    public function assignMember(Request $request, Card $card)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
        ]);

        $card->members()->syncWithoutDetaching([$validated['member_id']]);

        return response()->json($card->load(['tags', 'members']));
    }

    /**
     * Remove a member from the card.
     */
    public function removeMember(Card $card, Member $member)
    {
        $card->members()->detach($member->id);

        return response()->json($card->load(['tags', 'members']));
    }
}
