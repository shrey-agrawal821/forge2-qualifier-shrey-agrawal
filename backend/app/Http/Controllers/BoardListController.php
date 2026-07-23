<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class BoardListController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Board $board)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        if (!isset($validated['position'])) {
            $validated['position'] = $board->lists()->count();
        }

        $list = $board->lists()->create($validated);

        return response()->json($list, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BoardList $list)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|integer',
        ]);

        $list->update($validated);

        return response()->json($list);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BoardList $list)
    {
        $list->delete();
        return response()->json(null, 204);
    }
}
