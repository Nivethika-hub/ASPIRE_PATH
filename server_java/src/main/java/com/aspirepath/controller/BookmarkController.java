package com.aspirepath.controller;

import com.aspirepath.model.Bookmark;
import com.aspirepath.security.CustomUserDetails;
import com.aspirepath.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/{opportunityId}")
    public ResponseEntity<?> addBookmark(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long opportunityId) {
        try {
            bookmarkService.addBookmark(userDetails.getId(), opportunityId);
            return ResponseEntity.ok(Map.of("message", "Bookmarked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getBookmarks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookmarkService.getStudentBookmarks(userDetails.getId()));
    }

    @DeleteMapping("/{opportunityId}")
    public ResponseEntity<?> removeBookmark(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long opportunityId) {
        bookmarkService.removeBookmark(userDetails.getId(), opportunityId);
        return ResponseEntity.ok(Map.of("message", "Bookmark removed"));
    }

    @GetMapping("/check/{opportunityId}")
    public ResponseEntity<?> checkBookmark(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long opportunityId) {
        boolean bookmarked = bookmarkService.isBookmarked(userDetails.getId(), opportunityId);
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }
}
